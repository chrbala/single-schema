// @flow

import type { 
	AllFlattenerType, 
} from './shared/types';

import createCombineReducers from './createCombineReducers';
import { createArray, createAnd, createMaybe, createMap } from './operators';

export default (flatteners: AllFlattenerType<*>) => ({
	combine: createCombineReducers(flatteners),
	array: createArray(flatteners),
	and: createAnd(flatteners),
	maybe: createMaybe(flatteners),
	map: createMap(flatteners),
});
