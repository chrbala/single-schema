// @flow

import createCombineReducers from './createCombineReducers';
import { createArray, createAnd, createMaybe, createMap } from './operators';

import defaultSelection from './defaultSelection';

export const combineReducers = createCombineReducers(defaultSelection);

export const array = createArray(defaultSelection);
export const map = createMap(defaultSelection);
export const and = createAnd(defaultSelection);
export const maybe = createMaybe(defaultSelection);
