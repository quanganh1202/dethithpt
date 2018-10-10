import ES from '../../elastic';
import logger from './logger';
import constants from '../constant/common';

const filterParamsHandler = (filtersParam = {}, filterType = 'AND') => {
  try {
    const filterBody = Object.entries(filtersParam).reduce((arrFilters, filter) => {
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
          [filterType === 'AND' ? 'must': 'should']: filterBody,
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
      const noRaw = [
        'price',
        'numOfDownloaded',
        'numOfUploaded',
        'money',
        'createdAt',
        'updatedAt',
        'priority',
        'priorityCate',
        'totalPages',
        'view',
        'downloaded',
      ];
      pre[
        noRaw.includes(extractString[0]) ? extractString[0] : `${extractString[0]}.raw`
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
        ['createdAt', 'updatedAt', 'priority', 'priorityCate'].includes(sortToArray[0]) ? sortToArray[0] : `${sortToArray[0]}.raw`
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

const updateNumDocRefToCate = (cates, type) => {
  const cateModel =new ES('categories', 'category');
  const operation = type === constants.INCREASE ? '++' : '--';
  const promiseUpdateCates = cates.map((cate) => {
    return cateModel.updateByScript(
      cate.cateId,
      {
        source: `ctx._source.numDocRefs${operation};`,
        lang: 'painless',
      }
    );
  });

  return promiseUpdateCates;
};

const updateNumDocRefToCollection = (collections, type) => {
  const collectionModel =new ES('collections', 'collection');
  const operation = type === constants.INCREASE ? '++' : '--';

  const promiseUpdateCates = collections.map((collection) => {
    return collectionModel.updateByScript(
      collection.collectionId,
      {
        source: `ctx._source.numDocRefs${operation};`,
        lang: 'painless',
      }
    );
  });

  return promiseUpdateCates;
};

const updateNumDocRefToSubject = (subjects, type) => {
  const subjectModel =new ES('subjects', 'subject');
  const operation = type === constants.INCREASE ? '++' : '--';
  const promiseUpdate = subjects.map((subject) => {
    return subjectModel.updateByScript(
      subject.subjectId,
      {
        source: `ctx._source.numDocRefs${operation};`,
        lang: 'painless',
      }
    );
  });

  return promiseUpdate;
};

const updateNumDocRefToClass = (classes, type) => {
  const classModel =new ES('classes', 'class');
  const operation = type === constants.INCREASE ? '++' : '--';
  const promiseUpdate = classes.map((_class) => {
    return classModel.updateByScript(
      _class.classId,
      {
        source: `ctx._source.numDocRefs${operation};`,
        lang: 'painless',
      }
    );
  });

  return promiseUpdate;
};

const updateDocumentView = (documentId, type) => {
  const docModel =new ES('documents', 'document');
  const operation = type === constants.INCREASE ? '++' : '--';

  return docModel.updateByScript(
    documentId,
    {
      source: `ctx._source.view${operation};`,
      lang: 'painless',
    }
  );
};

const updateDocumentDownload = (documentId, type) => {
  const docModel =new ES('documents', 'document');
  const operation = type === constants.INCREASE ? '++' : '--';

  return docModel.updateByScript(
    documentId,
    {
      source: `ctx._source.downloaded${operation};`,
      lang: 'painless',
    }
  );
};

const updateUserUpload = (userId, type) => {
  const docModel =new ES('users', 'user');
  const operation = type === constants.INCREASE ? '++' : '--';

  return docModel.updateByScript(
    userId,
    {
      source: `ctx._source.numOfUploaded${operation};`,
      lang: 'painless',
    }
  );
};

const updateUserDownload = (userId, type) => {
  const docModel =new ES('users', 'user');
  const operation = type === constants.INCREASE ? '++' : '--';

  return docModel.updateByScript(
    userId,
    {
      source: `ctx._source.numOfDownloaded${operation};`,
      lang: 'painless',
    }
  );
};

const updateTagViewById = (tagId, type) => {
  const tagModel =new ES('tags', 'tag');
  const operation = type === constants.INCREASE ? '++' : '--';

  return tagModel.updateByScript(
    tagId,
    {
      source: `ctx._source.view${operation};`,
      lang: 'painless',
    }
  );
};

const updateMoneyUserById = (userId, money, type) => {
  const tagModel =new ES('users', 'user');
  const operation = type === constants.RECHARGE || type === constants.BONUS ? '+=' : '-=';

  return tagModel.updateByScript(
    userId,
    {
      source: `ctx._source.money${operation}${money};`,
      lang: 'painless',
    }
  );
};

const updateTagView = (tags = [], type) => {
  const tagModel =new ES('tags', 'tag');
  const operation = type === constants.INCREASE ? '++' : '--';

  const promiseUpdateTags = tags.map(tag => {
    return tagModel.updateByQuery(
      {
        source: `ctx._source.view${operation};`,
        lang: 'painless',
      },
      {
        match: {
          tag,
        },
      }
    );
  });

  return promiseUpdateTags;
};

const updateCollectionView = (datas = [], type) => {
  const collectionModel =new ES('collections', 'collection');
  const operation = type === constants.INCREASE ? '++' : '--';

  const promises = datas.map(data => {
    return collectionModel.updateByScript(
      data.collectionId,
      {
        source: `ctx._source.view${operation};`,
        lang: 'painless',
      }
    );
  });

  return promises;
};

const updateCateView = (datas = [], type) => {
  const cateModel =new ES('categories', 'category');
  const operation = type === constants.INCREASE ? '++' : '--';

  const promises = datas.map(data => {
    return cateModel.updateByScript(
      data.cateId,
      {
        source: `ctx._source.view${operation};`,
        lang: 'painless',
      }
    );
  });

  return promises;
};

const updateSubjectView = (datas = [], type) => {
  const subjectModel =new ES('subjects', 'subject');
  const operation = type === constants.INCREASE ? '++' : '--';

  const promises = datas.map(data => {
    return subjectModel.updateByScript(
      data.subjectId,
      {
        source: `ctx._source.view${operation};`,
        lang: 'painless',
      }
    );
  });

  return promises;
};

const updateClassView = (datas = [], type) => {
  const classModel =new ES('classes', 'class');
  const operation = type === constants.INCREASE ? '++' : '--';

  const promises = datas.map(data => {
    return classModel.updateByScript(
      data.classId,
      {
        source: `ctx._source.view${operation};`,
        lang: 'painless',
      }
    );
  });

  return promises;
};

const insertTag = async (tags, createdAt) => {
  const tagModel = new ES('tags', 'tag');
  const getPromises = tags.map(tag => {
    const filterModel = filterParamsHandler({ tag }).data;

    return tagModel.getList(filterModel);
  });
  const tagInfo = await Promise.all(getPromises);

  return tagInfo.map((tag, i) => {
    if (tag.error) {
      throw tag.error;
    }

    if (tag.data && !tag.data.length){
      return tagModel.insert({
        tag: tags[i],
        view: 1,
        priority: 0,
        createdAt,
      });
    }
  });
};

export {
  updateNumDocRefToClass,
  updateNumDocRefToSubject,
  updateUserDownload,
  updateMoneyUserById,
  insertTag,
  filterParamsHandler,
  sortParamsHandler,
  updateNumDocRefToCate,
  updateNumDocRefToCollection,
  updateTagView,
  updateDocumentView,
  updateTagViewById,
  updateCollectionView,
  updateCateView,
  updateClassView,
  updateSubjectView,
  updateDocumentDownload,
  updateUserUpload,
};