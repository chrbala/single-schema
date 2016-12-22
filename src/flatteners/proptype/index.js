// @flow

import reduce from './reduce';
import array from './array';
import and from './and';
import maybe from './maybe';

export * as leaves from './leaves';

import type { FlattenerType } from '../../shared/types';

const Coerce: () => FlattenerType<*> = () => ({
	reduce,
	array,
	and,
	maybe,
});

export default Coerce;
