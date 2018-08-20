import logger from '../src/libs/logger';
import esClient from './client';

const handleElasticsearchError = (error) => {
  logger.error(`[ELASTICSEARCH][ERROR]: ${error.message || error}`);

  return {
    statusCode: error.statusCode || 500,
    error: 'Unexpected Server Internal Error',
  };
};

function clearScrollAndReturnEmpty(scrollId) {
  return esClient.clearScroll({ scrollId: [scrollId] })
    .then(() => ({ statusCode: 204 }));
}


class ES {
  constructor(index, type) {
    this.index = index;
    this.type = type;
  }

  ping() {
    return esClient.ping({
      requestTimeout: process.env.ES_CONNECTION_TIMEOUT,
    }).then(() => ({ status: 200 }))
      .catch(handleElasticsearchError);
  }

  get(id){
    return esClient.get({
      index: this.index,
      type: this.type,
      id,
    }).then(response => ({
      statusCode: 200,
      data: response._source,
    })).catch(handleElasticsearchError);
  }

  getRaw(id) {
    return  esClient.get({
      index: this.index,
      type: this.type,
      id,
    }).then(response => ({
      statusCode: 200,
      data: response,
    })).catch(handleElasticsearchError);
  }

  getAll(fields, filters = {}, sort = {}, from, size) {
    const esFilters = Object.keys(filters).map(k => ({ term: { [k]: filters[k] } }));
    const esSorter = Object.entries(sort).map(s => ({ [s[0]]: { order: s[1] } }));

    return esClient.search({
      index: this.index,
      type: this.type,
      _source: fields,
      body: {
        from,
        size,
        query: {
          bool: {
            filter: esFilters,
          },
        },
        sort: esSorter,
      },
    }).then((response) => {
      const hits = response.hits.hits.map(h => h._source);

      return {
        statusCode: response.hits.total > size ? 206 : 200,
        totalSize: response.hits.total,
        data: hits,
      };
    }).catch(handleElasticsearchError);
  }

  getInitialScroll(fields, filters = {}, sort = {}) {
    const esFilters = Object.keys(filters).map(k => ({ term: { [k]: filters[k] } }));
    const esSorter = Object.entries(sort).map(s => ({ [s[0]]: { order: s[1] } }));

    return esClient.search({
      index: this.index,
      type: this.type,
      size: process.env.ES_DEFAULT_SIZE || 100,
      scroll: process.env.ES_TIMEOUT_SCROLL || '1m',
      _source: fields,
      body: {
        query: {
          bool: {
            filter: esFilters,
          },
        },
        sort: esSorter,
      },
    }).then((response) => {
      if (response.hits.hits.length === 0) {
        return clearScrollAndReturnEmpty(response._scroll_id);
      }

      const hits = response.hits.hits.map(h => h._source);

      return {
        statusCode: hits.length === 0 ? 204 : 200,
        data: { hits, scrollId: response._scroll_id },
      };
    }).catch(handleElasticsearchError);
  }

  getNextScroll(scrollId) {
    return esClient.scroll({
      scrollId,
      scroll: process.env.ES_TIMEOUT_SCROLL || '1m',
    }).then((response) => {
      if (response.hits.hits.length === 0) {
        return clearScrollAndReturnEmpty(scrollId);
      }

      const hits = response.hits.hits.map(h => h._source);

      return {
        statusCode: 200,
        data: { hits, scrollId },
      };
    }).catch(handleElasticsearchError);
  }

  insert(id, body) {
    return esClient.index({
      index: this.index,
      type: this.type,
      id,
      body,
    }).then(() => ({
      statusCode: 200,
    })).catch(handleElasticsearchError);
  }

  remove(id) {
    return esClient.delete({
      index: this.index,
      type: this.type,
      id,
    }).then(res => ({
      statusCode: res.deleted ? 204 : 404,
    })).catch(handleElasticsearchError);
  }

  getCount(filters) {
    const esFilters = Object.keys(filters).map(k => ({ term: { [k]: filters[k] } }));

    return esClient.count({
      index: this.index,
      type: this.type,
      body: {
        query: {
          bool: {
            filter: esFilters,
          },
        },
      },
    }).then(response => ({
      statusCode: 200,
      count: response.count,
    })).catch(handleElasticsearchError);
  }
}

export default ES;

