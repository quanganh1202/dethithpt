import amqp from 'amqplib/callback_api';
import logger from '../src/libs/logger';

amqp.connect('amqp://localhost', (errCon, conn) => {
  if (errCon) {
    logger.error(errCon.message || '[RABBITMQ]: RabbitMQ connection fail');
  }
  conn.createChannel((errCh, ch) => {
    if (errCh) {
      logger.error(errCon.message || '[RABBITMQ]: Create channel to be fail');
    }
    let ex = process.env.RABBIT_EX || 'dethithpt_query';
    ch.assertExchange(ex, 'topic', { durable: false });
    ch.assertQueue('', { exclusive: true }, function(err, q) {
      ch.bindQueue(q.queue, ex, '#'); // Get all message from topic

      ch.consume(q.queue, function(msg) {
        console.log(msg.fields.routingKey, msg.content.toString());
      }, { noAck: true });
    });
  });
});