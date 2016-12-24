// @flow

import reduce from './reduce';

import type { FlattenerType } from '../../shared/types';

const Coerce: () => FlattenerType<*> = () => ({
	reduce,
});

export default Coerce;
