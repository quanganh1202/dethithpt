import ES from 'elasticsearch';

// Connect to elasticsearch server
const client = new ES.Client({
  host: `http://${process.env.ES_HOST || 'localhost:9200'}`,
});

export default client;