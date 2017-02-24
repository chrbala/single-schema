// @flow

import type { GenericObjectType, AllReducerType } from '../shared/types';

type OptionsType = {
	cache: ?boolean,
};
export default ({cache: doesCache}: OptionsType) => {
	let lastInput = {};
	let lastOutput = {};
	const cache = {};
	let initial = true;

	return (keyset: AllReducerType, data: GenericObjectType, cb: *) => {
		if (!initial && data === lastInput)
			return lastOutput;

		const out = {};
		for (const key in keyset) 
			if (!initial && data[key] === lastInput[key])
				out[key] = cache[key];
			else
				cache[key] = out[key] = cb(keyset[key], data[key], key);

		if (doesCache) {
			lastInput = data;
			lastOutput = out;
			initial = false;
		}
		
		return out;
	};
};
