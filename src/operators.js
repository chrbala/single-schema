// @flow

import createOperator from './createOperator';

export const createArray = createOperator('array');
export const createMap = createOperator('map');
export const createAnd = createOperator('and');
export const createMaybe = createOperator('maybe');
