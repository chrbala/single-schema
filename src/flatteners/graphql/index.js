// @flow

import reduce from './reduce';
import array from './array';
import maybe from './maybe';

import type { InitialConfigType } from './types';

const GraphQLFlattener = (config: InitialConfigType) => ({
	reduce: reduce(config),
	array: array(config),
	maybe: maybe(config),
});

export default GraphQLFlattener;
