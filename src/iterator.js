// @flow

import type { GenericObjectType, ReducerType } from './types';

export const Iterator = (caches: ?boolean) => {
	let lastInput = {};
	let lastOutput = null;
	const cache = {};
	let initial = true;

	return (keyset: ReducerType<*>, data: GenericObjectType, cb: *) => {
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
