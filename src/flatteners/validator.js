// @flow

import { isObject } from '../util/micro';
import Iterator from '../util/iterator';
import { EXTRA_KEY_TEXT, EXPECTED_OBJECT } from '../shared/strings';

import type { 
	OptionsType, 
	ReducerType, 
	GenericObjectType,
} from '../shared/types';

const clean = obj => {
	const out = {};
	for (const key in obj)
		if (obj[key] !== null)
			out[key] = obj[key];
	return out;
};

export default ({cache}: OptionsType = {}) => 
	(children: ReducerType<*>) => {
		const iterate = Iterator({cache});

		return (data: GenericObjectType) => {
			if (data === undefined || data === null)
				return null;
			if (!isObject(data))
				return EXPECTED_OBJECT;

			const out = clean(iterate(children, data, 
				(child, datum) => child(datum)
			));

			for (const key in data)
				if (!children[key])
					out[key] = EXTRA_KEY_TEXT;

			return Object.keys(out).length ? out : null;
		};
	};
