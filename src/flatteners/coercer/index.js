// @flow

import reduce from './reduce';
import array from './array';
import and from './and';
import maybe from './maybe';

import type { FlattenerType } from '../../shared/types';

type CoerceType = (options: *) => FlattenerType<*>;

const Coerce: CoerceType = ({cache}: {cache: boolean} = {}) => ({
	reduce: reduce({cache}),
	array,
	and,
	maybe,
});

export default Coerce;
