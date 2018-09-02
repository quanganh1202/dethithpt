import amqp from 'amqplib/callback_api';
import logger from '../src/libs/logger';
import routings from '../src/constant/allowRoutings';

const rabbitProducer = (key, msg) => {
  return new Promise((resolve, reject) => {
    if (!routings.includes(key)) {
      reject({
        statusCode: 400,
        error: 'Routing key unsupported',
      });
    }
    const rabbitHost = process.env.RABBIT_HOST || 'amqp://localhost';
    amqp.connect(rabbitHost, (err, conn) => {
      if (err) {
        logger.error(`[RABBIT]: ${err.message || JSON.stringify(err)}`);
        reject({
          statusCode: err.status || 500,
          error: err.message || JSON.stringify(err) || 'Rabbit connection fail',
        });
      }
      conn.createChannel((errCh, ch) => {
        if (errCh) {
          logger.error(`[RABBIT]: ${errCh.message || JSON.stringify(errCh)}`);
          reject({
            statusCode: errCh.status || 500,
            error: errCh.message || JSON.stringify(errCh) || 'Rabbit create channel fail',
          });
        }
        ch.assertQueue('', { exclusive: true }, (errQ, q) => {
          if (errQ) {
            logger.error(`[RABBIT]: ${errQ.message || JSON.stringify(errQ) || 'Declare queue fail'}`);
            reject({
              statusCode: errCh.status || 500,
              error: errCh.message || JSON.stringify(errCh) || 'Rabbit create queue fail',
            });
          }
          let ex = process.env.RABBIT_TOPIC || 'topic_dethithpt';
          ch.assertExchange(ex, 'topic', { durable: false });
          ch.consume(q.queue, (msg) => {
            const content = JSON.parse(msg.content);
            resolve(content);
            conn.close();
          }, { noAck: true });
          const message = typeof msg === 'string' ? msg : JSON.stringify(msg);
          ch.publish(ex, key, new Buffer(message), { replyTo: q.queue });
        });
      });
    });
  });
};

export default rabbitProducer;
