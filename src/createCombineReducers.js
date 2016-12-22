// @flow

import { mapObj } from './util/micro';

import type { 
	AllReducerType, 
	AllFlattenerType,
	ReducerType,
} from './shared/types';

const unThunk = maybeThunk => 
	typeof maybeThunk == 'function'
		? maybeThunk()
		: maybeThunk
	;

type ReduceObjectType<T> = {
	[key: T]: ReducerType<T>,
};

type ArgType = AllFlattenerType<*>;
export default (flatteners: ArgType) => {
	const reducerFlatters: ReduceObjectType<*> = 
		mapObj(flatteners, flattener => flattener.reduce)
	;

	return (children: {} | () => {}) => {
		const out: AllReducerType = {};
		for (const name in reducerFlatters)
			out[name] = (...args) => {
				const reducers = mapObj(unThunk(children),
					child => child && child[name]
				);
				return reducerFlatters[name](reducers, out)(...args);
			};
		return out;
	};
};
