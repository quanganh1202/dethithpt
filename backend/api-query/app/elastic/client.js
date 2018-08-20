import ES from 'elasticsearch';

// Connect to elasticsearch server
const client = new ES.Client({
  host: process.env.ES_HOST || 'localhost',
  port: process.env.ES_PORT || 9200,
  log: process.env.ES_LOG_TYPE || 'error',
});

export default client;