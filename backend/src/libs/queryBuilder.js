import searchTypeConst from '../constant/searchType';
/**
   * The function to build string criteria query
   * @author Dung, Vu Anh <dungva1505@gmail.com>
   * @param {Array} criteriaList The list citeria [{ a: ['1', '4'], b: '2'}, { c: '3' }]
   * @return will be generated became ((a = '1' OR a = '4') AND b = '2') OR (c = '3')
*/
const queryBuilder = function buildQuery(criteriaList = [], searchType = searchTypeConst.EXACTLY) {
  let patern = '';
  let operator = '=';
  if (searchType === searchTypeConst.FULLTEXT) {
    operator = 'LIKE';
    patern = '%';
  }

  return criteriaList.reduce((criteriaString, criteriaObj) => {
    if (!criteriaObj) return criteriaString || '';
    const criteria = Object.entries(criteriaObj).reduce((pre, cur) => {
      const valueCriteria = cur[1] && cur[1].length === 1 ? cur[1] :
        Array.isArray(cur[1]) ? cur[1].reduce((preVal, curVal) => {
          if (preVal) return `${preVal} OR ${cur[0]} ${operator} '${patern}${curVal}${patern}'`;

          return `${cur[0]} ${operator} '${patern}${curVal}${patern}'`;
        }, undefined) : cur[1];

      if (pre) return Array.isArray(cur[1]) ? `${pre} AND (${valueCriteria})` :
        `${pre} AND ${cur[0]} ${operator} '${patern}${valueCriteria}${patern}'`;

      return Array.isArray(cur[1]) ? `(${valueCriteria})` :
        `${cur[0]} ${operator} '${patern}${valueCriteria}${patern}'`;
    }, undefined);

    if (!criteriaString) return criteria;

    return `(${criteriaString}) OR (${criteria})`;
  }, undefined);
};

export default queryBuilder;