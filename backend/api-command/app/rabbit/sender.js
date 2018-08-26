import amqp from 'amqplib/callback_api';
import logger from '../src/libs/logger';
import routings from '../src/constant/allowRoutings';

const rabbitProducer = (key, msg) => {
  return new Promise((resolve, reject) => {
    if (!(routings.includes(key) + 1)) {
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
        let ex = process.env.RABBIT_TOPIC || 'topic_dethithpt';
        ch.assertExchange(ex, 'topic', { durable: false });
        ch.publish(ex, key, new Buffer(msg));
        conn.close();
        resolve({
          statusCode: 200,
          data: 'Message is delivered',
        });
      });
    });
  });
};

export default rabbitProducer;
