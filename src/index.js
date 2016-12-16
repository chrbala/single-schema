// @flow

import createCombineReducers from './createCombineReducers';
import { createArray, createAnd } from './operators';

import defaultSelection from './defaultSelection';

export const combineReducers = createCombineReducers(defaultSelection);

export const array = createArray(defaultSelection);
export const and = createAnd(defaultSelection);
