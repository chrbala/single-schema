// @flow

import type { ReducerType, AnyFnType } from './shared/types';

const mapObj = (obj, cb) => {
	const out = {};
	for (const key in obj)
		out[key] = cb(obj[key], key);
	return out;
};

type OptionsType = {
	defaultFlattener: string,
};

const showAll = all =>
	Object.keys(all).join(', ');

const flattenerError = (name, all) =>
	`defaultFlattener ${name} selected, but not found in ${showAll(all)}!`;

type ReducerFlattenerType = {[key: string]: AnyFnType};
export default (
	flatteners: {[key: string]: ReducerFlattenerType}, 
	{defaultFlattener}: OptionsType = {}
) => {
	const reducerFlatters: ReducerFlattenerType = 
		mapObj(flatteners, flattener => flattener.reduce)
	;
	if (!defaultFlattener)
		throw new Error('Default flattener must be provided.');
	if (!reducerFlatters[defaultFlattener])
		throw new Error(flattenerError(defaultFlattener, reducerFlatters));

	return (children: *) => {
		const out: ReducerType<typeof reducerFlatters> = {};
		for (const name in reducerFlatters) {
			const childFlatteners = mapObj(children,
				child => defaultFlattener == name 
					&& typeof child == 'function'
						? child
						: child && child[name]
			);
			out[name] = reducerFlatters[name](childFlatteners, out);
		}
		return out;
	};
};
