// @flow

import reduce from './reduce';
import array from './array';
import map from './map';
import and from './and';
import maybe from './maybe';

import type { FlattenerType } from '../../shared/types';

type AsyncType = (flattener: FlattenerType<*>) => FlattenerType<*>;

const Async: AsyncType = flattener => ({
	reduce: reduce(flattener),
	array: array(flattener),
	// map: map(flattener),
	// and: and(flattener),
	// maybe: maybe(flattener),
});

export default Async;
