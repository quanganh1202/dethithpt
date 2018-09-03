import ES from 'elasticsearch';

// Connect to elasticsearch server
const client = new ES.Client({
  host: process.env.ES_HOST || 'http://localhost:9200',
});

export default client;