// @flow

import { isPromise, checkIfErrors, normalizeReducer } from './util';
import type { CombineReducersType } from './types';
import { PROMISE_NOT_PERCOLATED_ERROR, EXTRA_KEY_TEXT } from './strings';

const combineReducersBuilder: CombineReducersType = isAsync => props => {
	const passthroughFn = isAsync ? f => Promise.resolve(f) : f => f;

	let lastInput;
	let allLastOutput: {[key: $Keys<typeof props>]: *} = {};
	const types = {};
 
	for (const key in props) {
		const reducer = normalizeReducer(props[key]); 
		for (const reducerType in reducer) {
			types[reducerType] = true;
			const output = allLastOutput[reducerType] = reducer[reducerType](lastInput);
			if (!isAsync && isPromise(output))
				throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
		}
	}

	const createReducer = reducerType => data => {
		const lastOutput = allLastOutput[reducerType];

		if (!data)
			return isAsync ? Promise.resolve(null) : null;

		const errors = {};

		for (const key in props)
			if (lastOutput && typeof lastOutput == 'object' && lastInput && (key in lastInput) && (data[key] === lastInput[key])) {
				if (key in lastOutput)
					errors[key] = lastOutput[key];
			} else if (key in data) {
				const reducer = props[key];
				const { validate } = normalizeReducer(reducer);
				const error = validate(data[key]);
				if (error !== null) 
					errors[key] = error;
			}

		for (const key in data)
			if (!props[key])
				errors[key] = EXTRA_KEY_TEXT;

		lastInput = data;
		allLastOutput = { ...allLastOutput, [reducerType]: errors };

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

	const out = {
		validate: passthroughFn,
	};
	for (const key in types)
		out[key] = createReducer(key);
	return out;
};

export const combineReducers = combineReducersBuilder(false);
export const combineReducersAsync = combineReducersBuilder(true);
