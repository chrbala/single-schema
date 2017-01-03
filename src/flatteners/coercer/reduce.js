// @flow

import Iterator from '../../util/iterator';
import { freeze } from '../../util/micro';

import type { 
	AllReducerType, 
	ReducerType, 
	GenericObjectType,
} from '../../shared/types';

const subset = (obj1, obj2) => {
	const out = {};
	if (!obj1)
		return out;
	
	for (const key in obj2) 
		if (key in obj1)
			out[key] = obj1[key];

	return out;
};

const reduce: () => ReducerType<*> = ({cache}: {cache: boolean} = {}) => 
	(children: AllReducerType) => {
		const iterate = Iterator({cache});

		return (data: GenericObjectType) => freeze(
			subset(iterate(subset(children, data), data, 
				(child, datum) => child ? child(datum) : datum
			), children)
		);
	}
;

export default reduce;
