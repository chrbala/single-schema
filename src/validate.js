// @flow

import { isPromise, checkIfResults, normalizeReducer } from './util';
import type { CombineReducersType } from './types';
import { PROMISE_NOT_PERCOLATED_ERROR, EXTRA_KEY_TEXT } from './strings';

const combineReducersBuilder: CombineReducersType = isAsync => props => {
	const passthroughFn = isAsync ? f => Promise.resolve(f) : f => f;

	let lastInput;
	let allLastOutput: {[key: $Keys<typeof props>]: *} = {};
	const types = {};
 
	for (const key in props) {
		const reducer = normalizeReducer(props[key]); 
		for (const executorType in reducer) {
			types[executorType] = true;
			const output = allLastOutput[executorType] = reducer[executorType](lastInput);
			if (!isAsync && isPromise(output))
				throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
		}
	}

	const createReducer = executorType => data => {
		const lastOutput = allLastOutput[executorType];

		if (!data)
			return isAsync ? Promise.resolve(null) : null;

		const results = {};

		for (const key in props)
			if (lastOutput && typeof lastOutput == 'object' && lastInput && (key in lastInput) && (data[key] === lastInput[key])) {
				if (key in lastOutput)
					results[key] = lastOutput[key];
			} else if (key in data) {
				const execute = normalizeReducer(props[key])[executorType];
				const error = execute(data[key]);
				if (error !== null) 
					results[key] = error;
			}

		for (const key in data)
			if (!props[key])
				results[key] = EXTRA_KEY_TEXT;

		lastInput = data;
		allLastOutput = { ...allLastOutput, [executorType]: results };

		if (isAsync) 
			return (async () => {
				const asyncOutput = {};
				for (const key in results) {
					const error = await results[key];
					if (error !== null)
						asyncOutput[key] = error;
				}

				return checkIfResults(asyncOutput);
			})();

		return checkIfResults(results);
	};

	const out = {
		validate: passthroughFn,
	};
	for (const key in types)
		out[key] = createReducer(key);
	return out;
};

export const combineReducers = combineReducersBuilder(false);
export const combineReducersAsync = combineReducersBuilder(true);
