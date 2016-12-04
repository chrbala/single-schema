// @flow

import { isPromise, checkIfErrors, normalizeReducer } from './util';
import type { CombineReducersType } from './types';
import { PROMISE_NOT_PERCOLATED_ERROR, EXTRA_KEY_TEXT } from './strings';

const combineReducersBuilder: CombineReducersType = isAsync => props => {
	let lastInput;
	let lastOutput = {};

	for (const key in props) {
		const reducer = props[key];
		const { reduce } = normalizeReducer(reducer);
		lastOutput = reduce(lastInput);
		if (!isAsync && isPromise(lastOutput))
			throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
	}

	return data => {
		if (!data)
			return isAsync ? Promise.resolve(null) : null;

		const errors = {};

		for (const key in props)
			if (lastOutput && lastInput && (key in lastInput) && (data[key] === lastInput[key])) {
				if (key in lastOutput)
					errors[key] = lastOutput[key];
			} else if (key in data) {
				const reducer = props[key];
				const { reduce } = normalizeReducer(reducer);
				const error = reduce(data[key]);
				if (error !== null) 
					errors[key] = error;
			}

		for (const key in data)
			if (!props[key])
				errors[key] = EXTRA_KEY_TEXT;

		lastInput = data;
		lastOutput = errors;

		if (isAsync) 
			return (async () => {
				const asyncOutput = {};
				for (const key in errors) {
					const error = await errors[key];
					if (error !== null)
						asyncOutput[key] = error;
				}

				return checkIfErrors(asyncOutput);
			})();

		return checkIfErrors(errors);
	};
};

export const combineReducers = combineReducersBuilder(false);
export const combineReducersAsync = combineReducersBuilder(true);
