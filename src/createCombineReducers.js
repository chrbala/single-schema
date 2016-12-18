// @flow

import type { 
	AllReducerType, 
	AllFlattenerType,
	ReducerType,
} from './shared/types';

const mapObj = (obj, cb) => {
	const out = {};
	for (const key in obj)
		out[key] = cb(obj[key], key);
	return out;
};

type ReduceObjectType<T> = {
	[key: T]: ReducerType<T>,
};

export default (flatteners: AllFlattenerType<*>) => {
	const reducerFlatters: ReduceObjectType<*> = 
		mapObj(flatteners, flattener => flattener.reduce)
	;

	return (children: *) => {
		const out: AllReducerType<*> = {};
		for (const name in reducerFlatters) {
			const reducers = mapObj(children,
				child => child && child[name]
			);
			out[name] = reducerFlatters[name](reducers, out);
		}
		return out;
	};
};
