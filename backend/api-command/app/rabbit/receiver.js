import amqp from 'amqplib/callback_api';
import logger from '../src/libs/logger';
import document from '../src/handlers/documents';
const routingKey = ['document.convert'];

const rabbitMQConnector = () => {
  return new Promise((resolve, reject) => {
    const rabbitHost = `amqp://${process.env.RABBIT_HOST || 'localhost'}`;
    amqp.connect(rabbitHost, (err, conn) => {
      if (err) {
        logger.error(`[RabbitMQ]: ${err.message || JSON.stringify(err) || 'AMQP connection fail'}`);
        reject();
        process.exit(1); // Exit
      }
      logger.info('[RabbitMQ]: AMQP connection success');
      conn.createChannel((errCh, ch) => {
        if (errCh) {
          logger.error(`[RabbitMQ]: ${errCh.message || JSON.stringify(errCh) || 'Create channel fail'}`);
          reject();
          process.exit(1);
        }
        const ex = process.env.RABBIT_EXCHANGE || 'topic_dethithpt';
        ch.assertExchange(ex, 'topic', { durable: true });

        ch.assertQueue('', { exclusive: true }, (errQ, q) => {
          ch.prefetch(1); // Process one by one
          if (errQ) {
            logger.error(`[RabbitMQ]: ${errQ.message || JSON.stringify(errQ) || 'Declare queue fail'}`);
            reject();
            process.exit(1);
          }
          resolve(); // Just let we know connected to rabbit. Pls ignore it
          routingKey.forEach(r => {
            ch.bindQueue(q.queue, ex, r); // Get all message with routing key equal #
          });
          ch.consume(q.queue, async (msg) => {
            ch.ack(msg);
            const actor = msg.fields.routingKey.split('.');
            const content = JSON.parse(msg.content);
            let replyMessage;
            switch (actor[0]) {
            case 'document':
              replyMessage = await document[actor[1]](content.id, content.body, content.queryBody).catch(e => e);
              break;
            default:
              replyMessage = {
                statusCode: 500,
                error: 'Error from API query',
              };
              break;
            }
            // Notify to client the state of process
            replyMessage = typeof replyMessage === 'string' ? replyMessage : JSON.stringify(replyMessage);
            ch.sendToQueue(
              msg.properties.replyTo,
              new Buffer(replyMessage)
            );

            // Tell rabbitmq know the message was proceed
          }, { noAck: false });
        });
      });
    });
  });
};

export default rabbitMQConnector;