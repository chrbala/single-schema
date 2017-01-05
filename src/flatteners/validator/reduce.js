// @flow

import { freeze } from '../../util/micro';

import type { 
	AllReducerType, 
	ReducerType, 
	GenericObjectType,
} from '../../shared/types';

import { 
	EXTRA_KEY_TEXT, 
	EXPECTED_OBJECT, 
} from './strings';

import Iterator from '../../util/iterator';
import { isObject } from '../../util/micro';

const clean = obj => {
	const out = {};
	for (const key in obj)
		if (obj[key] !== null)
			out[key] = obj[key];
	return out;
};

export type OptionsType = {
	cache: boolean,
};
type LocalOptionsType = {
	ignore?: Array<string> | {[key: string]: boolean},
};
type ReduceType = (options: OptionsType) => ReducerType<*>;
const reduce: ReduceType = ({cache}) => 
	(children: AllReducerType) => () => {
		const iterate = Iterator({cache});

		return (data: GenericObjectType, options: LocalOptionsType = {}) => {
			let { ignore = {} } = options;
			ignore = Array.isArray(ignore)
				? ignore.reduce(
						(acc, prop) => (acc[prop] = true, acc)
					, {})
				: ignore
			;
			if (!isObject(data))
				return EXPECTED_OBJECT;

			const out = clean(iterate(children, data, 
				(child, datum) => child(datum, {ignore})
			));

			for (const key in data)
				if (!children[key] && !ignore[key])
					out[key] = EXTRA_KEY_TEXT;

			return Object.keys(out).length ? freeze(out) : null;
		};
	};

export default reduce;
