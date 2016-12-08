// @flow

import type { ReducerType } from './types';

const mapObj = (obj, cb) => {
	const out = {};
	for (const key in obj)
		out[key] = cb(obj[key], key);
	return out;
};

export const createCombineReducers = 
	(flatteners: {[key: string]: *}, standard: ?string) => 
		(children: *) => {
			const out: ReducerType<typeof flatteners> = {};
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
