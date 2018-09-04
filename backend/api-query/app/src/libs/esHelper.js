import ES from '../../elastic';
import logger from './logger';

const filterParamsHandler = (filtersParam = {}) => {
  try {
    const must = Object.entries(filtersParam).reduce((arrFilters, filter) => {
      if (filter[1]) {
        let should = [];
        if (Array.isArray(filter[1]) || filter[1].split(',').length) {
          const filters = Array.isArray(filter[1]) ? filter[1].join(',').split(',') : filter[1].split(',');
          should = filters.reduce((pre, cur) => {
            if (!pre.includes(cur)) {
              pre.push(cur);
            }

            return pre;
          }, [])
            .map(fval => {
              return {
                match: {
                  [filter[0]]: fval,
                },
              };
            });

          arrFilters.push({
            bool: {
              should,
            },
          });
        } else {
          arrFilters.push({
            match: {
              [filter[0]]: filter[1],
            },
          });
        }
      }

      return arrFilters;
    }, []);

    return {
      statusCode: 200,
      data: {
        bool: {
          must,
        },
      },
    };
  } catch (e) {
    logger.error(`[DOCUMENT] - ${e.message || e}`);

    return {
      statusCode: 400,
      error: e.message,
    };
  }
};

const sortParamsHandler = (sort) => {
  try {
    const sortForSearch = sort && Array.isArray(sort) ? sort.reduce((pre, cur) => {
      const extractString = cur.split('.');
      if (extractString.length !== 2) {
        throw new Error('Sort param is invalid format');
      }
      if (!['asc', 'desc'].includes(extractString[1])) {
        throw new Error('Sort type can only be asc or desc');
      }
      pre[
        extractString[0] === 'createdAt' || extractString[0] === 'updatedAt' ? extractString[0] : `${extractString[0]}.raw`
      ] = extractString[1];

      return pre;
    }, {}) : sort ? (() => {
      const sortToArray = sort.split('.');
      if (sortToArray.length !== 2) {
        throw new Error('Sort param is invalid format');
      }
      if (!['asc', 'desc'].includes(sortToArray[1])) {
        throw new Error('Sort type can only be asc or desc');
      }

      return {
        [
        sortToArray[0] === 'createdAt' || sortToArray[0] === 'updatedAt' ? sortToArray[0] : `${sortToArray[0]}.raw`
        ]: sortToArray[1],
      };
    })() : undefined;

    return {
      statusCode: 200,
      data: sortForSearch,
    };
  } catch (e) {
    logger.error(`[DOCUMENT] - ${e.message || e}`);

    return {
      statusCode: 400,
      error: e.message,
    };
  }
};

const insertToCateDoc = (docId, cates = [], createdAt) => {
  const cateDocRefs = new ES('catedocrefs', 'cateDocRef');
  const promiseCateDocRefs = cates.map((cate) => {
    return cateDocRefs.insert({
      cateId: cate.cateId,
      cateName: cate.cateName,
      docId,
      createdAt,
    });
  });

  return promiseCateDocRefs;
};

const insertToTagDoc = (docId, tags, createdAt) => {
  const tagDocRefs = new ES('tagdocrefs', 'tagDocRef');
  const promiseTagDocRefs = tags.map((tag) => {
    return tagDocRefs.insert({
      tagId: tag.tagId,
      docId,
      createdAt,
    });
  });

  return promiseTagDocRefs;
};

const updateNumDocRefToCate = (cates) => {
  const cateModel =new ES('categories', 'category');
  const promiseUpdateCates = cates.map((cate) => {
    return cateModel.updateByScrip(
      cate.cateId,
      {
        source: 'ctx._source.numDocRefs += params.numDocRefs;',
        lang: 'painless',
        params : {
          numDocRefs : 1,
        },
      }
    );
  });

  return promiseUpdateCates;
};

const insertTag = async (tags, createdAt) => {
  const tagModel = new ES('tags', 'tag');

  const getPromises = tags.map(tag => {
    const filterModel = filterParamsHandler({ tagId: tag.tagId }).data;

    return tagModel.getList(filterModel);
  });

  const tagInfo = await Promise.all(getPromises);

  return tagInfo.map((tag, i) => {
    if (tag.error) {
      throw tag.error;
    }

    if (tag.data && !tag.data.length){
      return tagModel.insert({
        tagId: tags[i].tagId,
        createdAt,
      });
    }
  });
};

const removeCateRefToDoc = (docId) => {
  const filters = filterParamsHandler({ docId });
  const cateDocRefs = new ES('catedocrefs', 'cateDocRef');

  return cateDocRefs.deleteByQuery(filters.data);
};

const removeTagRefToDoc = (docId) => {
  const filters = filterParamsHandler({ docId });
  const tagDocRefs = new ES('tagdocrefs', 'tagDocRef');

  return tagDocRefs.deleteByQuery(filters.data);
};

export {
  insertTag,
  filterParamsHandler,
  sortParamsHandler,
  insertToCateDoc,
  insertToTagDoc,
  removeCateRefToDoc,
  removeTagRefToDoc,
  updateNumDocRefToCate,
};
