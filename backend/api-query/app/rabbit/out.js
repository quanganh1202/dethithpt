let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    let ex = process.env.RABBIT_EX || 'dethithpt_query';
    let args = process.argv.slice(2);
    let key = (args.length > 0) ? args[0] : 'anonymous.info';
    let msg = args.slice(1).join(' ') || 'Hello World!';

    ch.assertExchange(ex, 'topic', { durable: false });
    ch.publish(ex, key, new Buffer(msg));
    console.log(' [x] Sent %s:\'%s\'', key, msg);
  });

  setTimeout(function() { conn.close(); process.exit(0); }, 500);
});