// @flow

import reduce from './reduce';
import { operation } from './shared';

import type { FlattenerType } from '../../shared/types';

const Coerce: () => FlattenerType<*> = () => ({
	reduce,
	array: operation,
	and: operation,
	maybe: operation,
});

export default Coerce;
