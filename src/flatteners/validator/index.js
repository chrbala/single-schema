// @flow

import reduce from './reduce';
import array from './array';
import and from './and';

import type { FlattenerType } from '../../shared/types';

type ValidatorType = (options: *) => FlattenerType<*>;

const Validator: ValidatorType = ({cache = false}: {cache: boolean} = {}) => ({
	reduce: reduce({cache}),
	array,
	and,
});

export default Validator;
