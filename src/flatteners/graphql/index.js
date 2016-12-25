// @flow

import reduce from './reduce';
import array from './array';

import type { FlattenerType } from '../../shared/types';

type ConfigType = {
	graphql: {},
};

const Coerce: (config: ConfigType) => FlattenerType<*> = ({graphql}) => ({
	reduce,
	array: array({graphql}),
});

export default Coerce;
