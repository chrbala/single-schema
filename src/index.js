// @flow

import createCombineReducers from './createCombineReducers';
import { createArray } from './operators';

import defaultSelection from './defaultSelection';

export const combineReducers = createCombineReducers(defaultSelection);

export const array = createArray(defaultSelection);
