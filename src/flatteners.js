// @flow

import Iterator from './iterator';
import { EXTRA_KEY_TEXT } from './strings';
import type { ReducerType, GenericObjectType } from './types';

type ChildrenType = ReducerType<*>;

const clean = obj => {
	const out = {};
	for (const key in obj)
		if (obj[key] !== null)
			out[key] = obj[key];
	return out;
};

type OptionsType = {
	cache?: boolean,
};

export const Validator = ({cache}: OptionsType = {}) => 
	(children: ChildrenType) => {
		const iterate = Iterator({cache});

		return (data: GenericObjectType) => {
			if (!data)
				return null;

			const out = clean(iterate(children, data, 
				(child, datum) => child(datum)
			));

			for (const key in data)
				if (!children[key])
					out[key] = EXTRA_KEY_TEXT;

			return Object.keys(out).length ? out : null;
		};
	};

const subset = (obj1, obj2) => {
	const out = {};
	for (const key in obj2) 
		out[key] = obj1[key];
	return out;
};
export const Coercer = ({cache}: OptionsType = {}) => 
	(children: ChildrenType) => {
		const iterate = Iterator({cache});

		return (data: GenericObjectType) => iterate(subset(children, data), data, 
			(child, datum) => child ? child(datum) : datum
		);
	};

export const Shaper = () => (children: ChildrenType) => () => {
	const out = {};
	for (const key in children) {
		const child = children[key];
		out[key] = child ? child() : true;
	}
	return out;
};
