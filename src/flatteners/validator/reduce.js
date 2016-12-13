// @flow

import type { ReducerType, GenericObjectType } from '../../shared/types';

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

export default ({cache}: {cache: boolean} = {}) => 
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
