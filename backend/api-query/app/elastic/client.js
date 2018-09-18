import ES from 'elasticsearch';

// Connect to elasticsearch server
const client = new ES.Client({
  host: `http://${process.env.ES_HOST}:9200` || 'http://localhost:9200',
});

export default client;