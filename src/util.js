// @flow

import type { 
	ReducerType, 
	NormalizedReducerType,
} from './types';

export const isPromise = (value: *) => value instanceof Promise;
export const checkIfErrors = (output: *) => 
	Object.keys(output).length ? output : null;

type NormalizeType = (reducer: ReducerType) => NormalizedReducerType;
export const normalizeReducer: NormalizeType = reducer =>
	typeof reducer == 'function'
		? { validate: reducer }
		: reducer
;
