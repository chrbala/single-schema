// @flow

import type { ReducerType, AnyFnType } from './shared/types';

const mapObj = (obj, cb) => {
	const out = {};
	for (const key in obj)
		out[key] = cb(obj[key], key);
	return out;
};

type ReducerFlattenerType = {[key: string]: AnyFnType};

export default (
	flatteners: {[key: string]: ReducerFlattenerType}, 
	next: void,
) => {
	const reducerFlatters: ReducerFlattenerType = 
		mapObj(flatteners, flattener => flattener.reduce)
	;

	return (children: *) => {
		const out: ReducerType<typeof reducerFlatters> = {};
		for (const name in reducerFlatters) {
			const childFlatteners = mapObj(children,
				child => child && child[name]
			);
			out[name] = reducerFlatters[name](childFlatteners, out);
		}
		return out;
	};
};
