import amqp from 'amqplib/callback_api';
import logger from '../src/libs/logger';
import document from '../src/handlers/documents';
import category from '../src/handlers/category';
import collection from '../src/handlers/collection';
import subject from '../src/handlers/subject';
import _class from '../src/handlers/class';
import user from '../src/handlers/user';
import purchase from '../src/handlers/purchase';
import tag from '../src/handlers/tag';
import news from '../src/handlers/news';
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
  'collection.create',
  'collection.update',
  'collection.delete',
  'class.create',
  'class.update',
  'class.delete',
  'subject.create',
  'subject.update',
  'subject.delete',
  'news.create',
  'news.update',
  'news.delete',
  'purchase.create',
  'tag.update',
];

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
            case 'user':
              replyMessage = await user[actor[1]](content.id, content.body).catch(e => e);
              break;
            case 'class':
              replyMessage = await _class[actor[1]](content.id, content.body).catch(e => e);
              break;
            case 'collection':
              replyMessage = await collection[actor[1]](content.id, content.body).catch(e => e);
              break;
            case 'subject':
              replyMessage = await subject[actor[1]](content.id, content.body).catch(e => e);
              break;
            case 'purchase':
              replyMessage = await purchase[actor[1]](content.id, content.body).catch(e => e);
              break;
            case 'tag':
              replyMessage = await tag[actor[1]](content.id, content.body).catch(e => e);
              break;
            case 'news':
              replyMessage = await news[actor[1]](content.id, content.body).catch(e => e);
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