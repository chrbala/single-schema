// @flow

import Iterator from '../util/iterator';

import type { 
	ReducerType, 
	OptionsType, 
	GenericObjectType,
} from '../shared/types';

const subset = (obj1, obj2) => {
	const out = {};
	for (const key in obj2) 
		out[key] = obj1[key];
	return out;
};

export default ({cache}: OptionsType = {}) => 
	(children: ReducerType<*>) => {
		const iterate = Iterator({cache});

		return (data: GenericObjectType) => iterate(subset(children, data), data, 
			(child, datum) => child ? child(datum) : datum
		);
	};
