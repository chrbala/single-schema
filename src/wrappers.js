// @flow

import { isPromise, checkIfErrors } from './util';
import { 
	PROMISE_NOT_PERCOLATED_ERROR, 
	EXTRA_KEY_TEXT, 
	MISSING_KEY_TEXT,
} from './strings';
import type { WrapperType, AsyncWrapperType } from './types';

const throwIfAsync = fn => {
	if (isPromise(fn(undefined)))
		throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
};

export const NonNull: WrapperType = 
	reduce => {
		throwIfAsync(reduce);

		return value => value !== undefined && value !== null
			? reduce(value)
			: MISSING_KEY_TEXT
		;
	};

export const Permissive: WrapperType = reduce => {
	throwIfAsync(reduce);

	return value => {
		const out = {};
		const result = reduce(value);
		if (!result)
			return result;

		if (typeof result === 'string') {
			if (result == EXTRA_KEY_TEXT)
				return null;
			return result;
		}
		
		for (const key in result)
			if (result[key] !== EXTRA_KEY_TEXT)
				out[key] = result[key];
		return checkIfErrors(out);
	};
};

export const PermissiveAsync: AsyncWrapperType = reduce => 
	value => Promise.resolve(reduce(value))
		.then(syncValue => Permissive(f => f)(syncValue))
;
