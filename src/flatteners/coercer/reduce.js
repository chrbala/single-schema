// @flow

import Iterator from '../../util/iterator';

import type { 
	AllReducerType, 
	ReducerType, 
	GenericObjectType,
} from '../../shared/types';

const subset = (obj1, obj2) => {
	const out = {};
	for (const key in obj2) 
		out[key] = obj1[key];
	return out;
};

const reduce: () => ReducerType<*> = ({cache}: {cache: boolean} = {}) => 
	(children: AllReducerType<*>) => {
		const iterate = Iterator({cache});

		return (data: GenericObjectType) => iterate(subset(children, data), data, 
			(child, datum) => child ? child(datum) : datum
		);
	}
;

export default reduce;
