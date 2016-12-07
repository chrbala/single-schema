// @flow

import { isAsync, checkIfResults, normalizeReducer } from './util';
import { 
	PROMISE_NOT_PERCOLATED_ERROR, 
	EXTRA_KEY_TEXT, 
	MISSING_KEY_TEXT,
} from './strings';
import type { WrapperType, ReducerType, NormalizedReducerType } from './types';

const passthroughAsyncFn = f => Promise.resolve(f);
type WrapAsyncType = (w: WrapperType) => WrapperType;
const wrapAsync: WrapAsyncType = wrapper => toBeWrapped => {
	const reducer = normalizeReducer(toBeWrapped);
	const out = {
		validate: passthroughAsyncFn,
	};

	const wrap = kind => value => Promise.resolve(reducer[kind](value))
		.then(syncValue => {
			const childReducer = wrapper(f => f);
			return childReducer[kind](syncValue);
		});
	;

	for (const kind in reducer)
		out[kind] = wrap(kind);
	return out;
};

const throwIfAsync = validator => {
	const reducer = normalizeReducer(validator);
	for (const key in reducer)
		if (isAsync(reducer[key]))
			throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
};

export const NonNull: WrapperType = validator => {
	const reducer = normalizeReducer(validator);
	throwIfAsync(reducer);

	const validate = value => value !== undefined && value !== null
		? reducer.validate(value)
		: MISSING_KEY_TEXT
	;

	return { ...reducer, validate };
};

export const NonNullAsync = wrapAsync(NonNull, 'validate');

export const Permissive: WrapperType = validator => {
	const reducer = normalizeReducer(validator);
	throwIfAsync(reducer);

	const validate = value => {
		const out = {};
		const result = reducer.validate(value);
		if (!result || typeof result !== 'object')
			return result;

		for (const key in result)
			if (result[key] !== EXTRA_KEY_TEXT)
				out[key] = result[key];
		return checkIfResults(out);
	};

	return { ...reducer, validate };
};

export const PermissiveAsync = wrapAsync(Permissive, 'validate');

export const And = 
	(...validators: Array<ReducerType>) => {
		const reducers = validators.map(normalizeReducer);
		reducers.forEach(throwIfAsync);
		const finalReducer: NormalizedReducerType = reducers.reduce(
			(acc, next) => {
				const out = { ...acc };
				for (const key in next)
					out[key] = 
						key == 'validate'
							? value => acc[key](value) || next[key](value)
							: acc[key]
								? value => next[key](acc[key](value))
								: next[key]
					;
				return out;
			}, {
				validate: () => null,
			})
		;

		return finalReducer;
	};
