// @flow

import { isPromise, checkIfErrors, normalizeReducer } from './util';
import { 
	PROMISE_NOT_PERCOLATED_ERROR, 
	EXTRA_KEY_TEXT, 
	MISSING_KEY_TEXT,
} from './strings';
import type { WrapperType } from './types';

type WrapAsyncType = (w: WrapperType, k: string) => WrapperType;
const wrapAsync: WrapAsyncType = (wrapper, kind) => toBeWrapped => {
	const reducer = normalizeReducer(toBeWrapped);
	const wrapped = value => Promise.resolve(reducer[kind](value))
		.then(syncValue => {
			const childReducer = wrapper(f => f);
			return childReducer[kind](syncValue);
		});
	;
	return { ...reducer, [kind]: wrapped };
};

const throwIfAsync = validator => {
	const { validate } = normalizeReducer(validator);
	if (isPromise(validate(undefined)))
		throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
};

export const NonNull: WrapperType = 
validator => {
	const reducer = normalizeReducer(validator);
	throwIfAsync(reducer.validate);

	const validate = value => value !== undefined && value !== null
		? reducer.validate(value)
		: MISSING_KEY_TEXT
	;

	return { ...reducer, validate };
};

export const NonNullAsync = wrapAsync(NonNull, 'validate');

export const Permissive: WrapperType = validator => {
	const reducer = normalizeReducer(validator);
	throwIfAsync(reducer.validate);

	const validate = value => {
		const out = {};
		const result = reducer.validate(value);
		if (!result || typeof result !== 'object')
			return result;

		for (const key in result)
			if (result[key] !== EXTRA_KEY_TEXT)
				out[key] = result[key];
		return checkIfErrors(out);
	};

	return { ...reducer, validate };
};

export const PermissiveAsync = wrapAsync(Permissive, 'validate');
