// @flow

import reduce from './reduce';
import array from './array';
import and from './and';
import maybe from './maybe';

import * as _leaves from './leaves';
export const leaves = _leaves;

import type { FlattenerType } from '../../shared/types';

type ValidatorType = (options: *) => FlattenerType<*>;

const Validator: ValidatorType = ({cache = false}: {cache: boolean} = {}) => ({
	reduce: reduce({cache}),
	array,
	and,
	maybe,
});

export default Validator;
