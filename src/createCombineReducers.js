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

export default (
	flatteners: {[key: string]: AnyFnType}, 
	{defaultFlattener}: OptionsType = {}
) => {
	if (!defaultFlattener)
		throw new Error('Default flattener must be provided.');
	if (!flatteners[defaultFlattener])
		throw new Error(flattenerError(defaultFlattener, flatteners));

	return (children: *) => {
		const out: ReducerType<typeof flatteners> = {};
		for (const name in flatteners) {
			const childFlatteners = mapObj(children,
				(child) => defaultFlattener == name 
					&& typeof child == 'function'
						? child
						: child && child[name]
			);
			out[name] = flatteners[name](childFlatteners, out);
		}
		return out;
	};
};
