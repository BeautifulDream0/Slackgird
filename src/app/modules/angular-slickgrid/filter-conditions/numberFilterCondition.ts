import { OperatorType } from './../models/operatorType.enum';
import { FilterCondition, FilterConditionOption } from '../models/index';
import { testFilterCondition } from './filterUtilities';

export const numberFilterCondition: FilterCondition = (options: FilterConditionOption) => {
  const cellValue = parseFloat(options.cellValue);
  const searchTerm = (Array.isArray(options.searchTerms) && options.searchTerms[0]) || 0;

  let isRangeSearch = false;
  let searchValue1;
  let searchValue2;

  if (typeof searchTerm === 'string') {
    if (searchTerm.indexOf('..') >= 0) {
      isRangeSearch = true;
      const searchValues = searchTerm.split('..');
      searchValue1 = parseFloat(Array.isArray(searchValues) && searchValues[0]);
      searchValue2 = parseFloat(Array.isArray(searchValues) && searchValues[1]);
    } else {
      searchValue1 = parseFloat(searchTerm);
    }
  } else {
    searchValue1 = searchTerm;
  }

  if (!searchTerm && !options.operator) {
    return true;
  }

  if (isRangeSearch) {
    const isInclusive = options.operator && options.operator === OperatorType.rangeIncluside;
    const resultCondition1 = testFilterCondition((isInclusive ? '>=' : '>'), cellValue, searchValue1);
    const resultCondition2 = testFilterCondition((isInclusive ? '<=' : '<'), cellValue, searchValue2);
    return (resultCondition1 && resultCondition2);
  }
  return testFilterCondition(options.operator || '==', cellValue, searchValue1);
};
