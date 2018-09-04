import amqp from 'amqplib/callback_api';
import logger from '../src/libs/logger';
import routings from '../src/constant/allowRoutings';

/**
 * Vũ Anh Dũng
 * Function để send 1 message từ command => query
 * @param {string} key Gồm 2 phần phân cách bằng dấu chấm (.). Phần đầu là tên model, phần sau là loại action (document.create)
 * @param {object} msg Dữ liệu truyền sang query gồm 2 props là id và body. Id là id của dữ liệu trên mysql, body là dữ liệu
 * Cần truyền Id sang vì cần đồng bộ dữ liệu cùng id giữa command và query
 * @return {Promise} function return 1 Promise để thông báo trạng thái sau khi nhận message và xử lý từ api-query
 */
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
