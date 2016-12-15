// @flow

import type { 
	ReducerType, 
	FlattenerType, 
	AllFlattenerType,
} from './shared/types';

const mapObj = (obj, cb) => {
	const out = {};
	for (const key in obj)
		out[key] = cb(obj[key], key);
	return out;
};

export default (flatteners: AllFlattenerType) => {
	const reducerFlatters: FlattenerType = 
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
