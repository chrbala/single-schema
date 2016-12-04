// @flow

import type { ReducerType } from './types';

export const isPromise = (value: *) => value instanceof Promise;
export const checkIfErrors = (output: *) => 
	Object.keys(output).length ? output : null;

const coerce = (f: *) => f;
export const normalizeReducer = (reduce: ReducerType) =>
	typeof reduce == 'function'
		? { reduce, coerce }
		: reduce
;
