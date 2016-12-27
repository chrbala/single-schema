// @flow

import reduce from './reduce';
import array from './array';
import map from './map';
import and from './and';
import maybe from './maybe';

import type { FlattenerType } from '../../shared/types';

type ValidatorType = (options: *) => FlattenerType<*>;

const Validator: ValidatorType = ({cache = false}: {cache: boolean} = {}) => ({
	reduce: reduce({cache}),
	array,
	map,
	and,
	maybe,
});

export default Validator;
