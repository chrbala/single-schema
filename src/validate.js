// @flow

import { isPromise, checkIfResults, normalizeReducer } from './util';
import type { CombineReducersType } from './types';
import { PROMISE_NOT_PERCOLATED_ERROR, EXTRA_KEY_TEXT } from './strings';

const mapObj = (obj, cb) => {
	const out = {};
	for (const key in obj)
		out[key] = cb(obj[key], key);
	return out;
};
const createCombineReducers = (flatteners: {}, standard: ?string) => (children: *) => {
	const out = {};
	for (const name in flatteners) {
		const childFlatteners = mapObj(children, 
			(child) => standard && standard == name && typeof child == 'function'
				? child
				: child[name]
		);
		out[name] = flatteners[name](childFlatteners);
	}
	return out;
};

const Iterator = (caches: boolean) => {
	let lastInput = {};
	let lastOutput = null;
	const cache = {};
	let initial = true;

	return (keyset, data, cb) => {
		if (!initial && data === lastInput)
			return lastOutput;

		const out = {};
		for (const key in keyset) 
			if (!initial && data[key] === lastInput[key])
				out[key] = cache[key];
			else
				cache[key] = out[key] = cb(keyset[key], data[key], key);

		if (caches) {
			lastInput = data;
			lastOutput = out;
			initial = false;
		}
		
		return out;
	};
};

const clean = obj => {
	const out = {};
	for (const key in obj)
		if (obj[key] !== null)
			out[key] = obj[key];
	return out;
};

const Validator = ({cache} = {}) => children => {
	const iterate = Iterator(cache);

	return data => {
		if (!data)
			return null;

		const out = clean(iterate(children, data, 
			(child, datum) => child(datum)
		));

		for (const key in data)
			if (!children[key])
				out[key] = EXTRA_KEY_TEXT;

		return Object.keys(out).length ? out : null;
	};
};

const subset = (obj1, obj2) => {
	const out = {};
	for (const key in obj2) 
		out[key] = obj1[key];
	return out;
};
const Coercer = ({cache} = {}) => children => {
	const iterate = Iterator(cache);

	return data => iterate(subset(children, data), data, 
		(child, datum) => child ? child(datum) : datum
	);
};

const Shaper = () => children => () => {
	const out = {};
	for (const key in children) {
		const child = children[key];
		out[key] = child ? child() : true;
	}
	return out;
};

export const combineReducers = createCombineReducers({
	validate: Validator({cache: true}),
	coerce: Coercer({cache: true}),
	shape: Shaper(),
}, 'validate');

const combineReducersBuilder: CombineReducersType = isAsync => props => {
	let lastInput;
	let allLastOutput: {[key: $Keys<typeof props>]: *} = {};
	const types = {};
	const normalizedReducers = {};
 
	for (const key in props) {
		const reducer = normalizedReducers[key] = normalizeReducer(props[key]); 
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

		for (const key in normalizedReducers)
			if (lastOutput && typeof lastOutput == 'object' && lastInput && (key in lastInput) && (data[key] === lastInput[key])) {
				if (key in lastOutput)
					results[key] = lastOutput[key];
			} else if (key in data) {
				const execute = normalizedReducers[key][executorType];
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
		validate: isAsync ? () => Promise.resolve(null) : () => null,
	};
	for (const key in types)
		out[key] = createReducer(key);
	return out;
};

// export const combineReducers = combineReducersBuilder(false);
export const combineReducersAsync = combineReducersBuilder(true);
