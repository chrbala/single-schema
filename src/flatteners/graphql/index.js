// @flow

import reduce from './reduce';
import array from './array';
import maybe from './maybe';

import type { FlattenerType } from '../../shared/types';

type ConfigType = {
	graphql: {},
};
type GraphqlFlattenerType = (config: ConfigType) => FlattenerType<*>;

const GraphQLFlattener: GraphqlFlattenerType = ({graphql}) => ({
	reduce,
	array: array({graphql}),
	maybe: maybe({graphql}),
});

export default GraphQLFlattener;
