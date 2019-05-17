import { Column, GroupTotalsFormatter } from './../models/index';
import { formatNumber } from '../services/utilities';
import { getValueFromParamsOrGridOptions } from '../formatters/formatterUtilities';

export const sumTotalsBoldFormatter: GroupTotalsFormatter = (totals: any, columnDef: Column, grid?: any) => {
  const field = columnDef.field || '';
  const val = totals.sum && totals.sum[field];
  const params = columnDef && columnDef.params;
  const prefix = params && params.groupFormatterPrefix || '';
  const suffix = params && params.groupFormatterSuffix || '';
  const minDecimal = getValueFromParamsOrGridOptions('minDecimal', columnDef, grid);
  const maxDecimal = getValueFromParamsOrGridOptions('maxDecimal', columnDef, grid);
  const displayNegativeNumberWithParentheses = getValueFromParamsOrGridOptions('displayNegativeNumberWithParentheses', columnDef, grid, false);

  if (val != null && !isNaN(+val)) {
    const formattedNumber = formatNumber(val, minDecimal, maxDecimal, displayNegativeNumberWithParentheses);
    return `<b>${prefix}${formattedNumber}${suffix}</b>`;
  }
  return '';
};
