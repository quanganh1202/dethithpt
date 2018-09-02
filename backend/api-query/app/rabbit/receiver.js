import amqp from 'amqplib/callback_api';
import logger from '../src/libs/logger';
import document from '../src/handlers/documents';
import category from '../src/handlers/category';
const routingKey = [
  'document.create',
  'document.update',
  'document.delete',
  'user.create',
  'user.update',
  'user.delete',
  'category.create',
  'category.update',
  'category.delete',
];

const rabbitMQConnector = () => {
  return new Promise((resolve, reject) => {
    const rabbitHost = process.env.RABBIT_HOST || 'amqp://localhost';
    amqp.connect(rabbitHost, (err, conn) => {
      if (err) {
        logger.error(err.message || JSON.stringify(err) || '[RabbitMQ]: AMQP connection fail');
        reject();
        process.exit(1); // Exit
      }
      logger.info('[RabbitMQ]: AMQP connection success');
      conn.createChannel((errCh, ch) => {
        if (errCh) {
          logger.error(errCh.message || JSON.stringify(errCh) || '[RabbitMQ]: Create channel fail');
          reject();
          process.exit(1);
        }
        const ex = process.env.RABBIT_EXCHANGE || 'topic_dethithpt';
        ch.assertExchange(ex, 'topic', { durable: false });

        ch.assertQueue('', { exclusive: true }, (errQ, q) => {
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
            const actor = msg.fields.routingKey.split('.');
            const content = JSON.parse(msg.content);
            let replyMessage;
            switch (actor[0]) {
            case 'document':
              replyMessage = await document[actor[1]](content.id, content.body).catch(e => e);
              break;
            case 'category':
              replyMessage = await category[actor[1]](content.id, content.body).catch(e => e);
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

            ch.ack(msg);
            // Tell rabbitmq know the message was proceed
          }, { noAck: false });
        });
      });
    });
  });
};

export default rabbitMQConnector;