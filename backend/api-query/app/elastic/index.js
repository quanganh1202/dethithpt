import logger from '../src/libs/logger';
import esClient from './client';

const handleElasticsearchError = (error) => {
  logger.error(`[ELASTICSEARCH]: ${error.message || error}`);

  return {
    statusCode: error.statusCode || 500,
    error: 'Unexpected Server Internal Error',
  };
};

function clearScrollAndReturnEmpty(scrollId) {
  return esClient.clearScroll({ scrollId: [scrollId] })
    .then(() => ({ statusCode: 204, data: [], scrollId, isLastPage: true }));
}

class ES {
  constructor(index, type) {
    this.index = index;
    this.type = type;
  }

  ping() {
    return esClient.ping({
      requestTimeout: process.env.ES_CONNECTION_TIMEOUT,
    }).then(() => ({ statusCode: 200 }))
      .catch((error) => {
        logger.error(`[ELASTICSEARCH]: ${error.message || error}`);
        esClient.close();

        return {
          statusCode: error.statusCode || 500,
          error: error.message || 'Unexpected Server Internal Error',
        };
      });
  }

  close() {
    return esClient.close();
  }

  get(id){
    return esClient.get({
      index: this.index,
      type: this.type,
      id,
    }).then(response => ({
      statusCode: 200,
      data: response._source,
    })).catch((err) => {
      if (err.statusCode === 404) {
        return {
          statusCode: 404,
          error: 'Not Found',
        };
      }

      return handleElasticsearchError(err);
    });
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

  getList(filters = {}, fields, sort = {}, from, size) {
    const esSorter = Object.entries(sort).map(s => ({ [s[0]]: { order: s[1] } }));

    return esClient.search({
      index: this.index,
      type: this.type,
      _source: fields,
      body: {
        from,
        size,
        query: filters,
        sort: esSorter,
      },
    }).then((response) => {
      const hits = response.hits.hits.map(h => {
        h._source.id = h._id;

        return h._source;
      });

      return {
        statusCode: response.hits.total > size ? 206 : 200,
        total: response.hits.total,
        data: hits,
      };
    }).catch(handleElasticsearchError);
  }

  getInitialScroll(filters = {}, fields, sort = {}, size) {
    const esSorter = Object.entries(sort).map(s => ({ [s[0]]: { order: s[1] } }));

    return esClient.search({
      index: this.index,
      type: this.type,
      size: size || process.env.ES_DEFAULT_SIZE || 100,
      scroll: process.env.ES_TIMEOUT_SCROLL || '1m',
      _source: fields,
      body: {
        query: filters,
        sort: esSorter,
      },
    }).then((response) => {
      if (response.hits.hits.length === 0) {
        return clearScrollAndReturnEmpty(response._scroll_id);
      }
      const hits = response.hits.hits.map(h => {
        h._source.id = h._id;

        return h._source;
      });

      return {
        statusCode: hits.length === 0 ? 204 : 200,
        data: hits,
        scrollId: response._scroll_id,
        total: response.hits.total,
        isLastPage: false,
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

      const hits = response.hits.hits.map(h => {
        h._source.id = h._id;

        return h._source;
      });

      return {
        statusCode: 200,
        data: hits,
        scrollId,
        total: response.hits.total,
        isLastPage: false,
      };
    }).catch((err) => {
      if (err.statusCode === 404) {
        return {
          statusCode: 404,
          error: 'ScrollID is expired or has been cleared',
        };
      }

      return handleElasticsearchError(err);
    });
  }

  insert(body, id) {
    return esClient.index({
      index: this.index,
      type: this.type,
      id, // If no id is provided, elasticsearch auto generate unique id
      refresh: 'wait_for',
      body,
    }).then((result) => {
      return {
        statusCode: 200,
        createdId: result._id,
      };
    }).catch(handleElasticsearchError);
  }

  update(body, id) {
    return esClient.update({
      index: this.index,
      type: this.type,
      id, // If no id is provided, elasticsearch auto generate unique id
      refresh: 'wait_for',
      body: {
        doc: body,
      },
    }).then((result) => {
      return {
        statusCode: 200,
        updatedId: result._id,
      };
    }).catch(handleElasticsearchError);
  }

  remove(id) {
    return esClient.delete({
      index: this.index,
      type: this.type,
      id,
    }).then(res => ({
      statusCode: res.result === 'deleted' ? 204 : 404,
    })).catch(handleElasticsearchError);
  }

  deleteByQuery(filters) {
    return esClient.deleteByQuery({
      index: this.index,
      type: this.type,
      body: {
        query: filters,
      },
    });
  }

  getCount(filters) {
    return esClient.count({
      index: this.index,
      type: this.type,
      body: {
        query: filters,
      },
    }).then(response => ({
      statusCode: 200,
      count: response.count,
    })).catch(handleElasticsearchError);
  }

  getAggs(field) {
    return esClient.search({
      index: this.index,
      type: this.type,
      body: {
        aggs: {
          myAggs: {
            terms: {
              field,
            },
          },
        },
      },
    }).then(response => ({
      statusCode: 200,
      aggs: response.aggregations.myAggs.buckets,
    })).catch(handleElasticsearchError);
  }

  updateByQuery(script, query) {
    return esClient.updateByQuery({
      index: this.index,
      type: this.type,
      refresh: 'wait_for',
      body:{
        query,
        script,
      },
    });
  }

  updateByScript(id, script) {
    return esClient.update({
      index: this.index,
      type: this.type,
      id,
      refresh: 'wait_for',
      body:{
        script,
      },
    });
  }
}

export default ES;

