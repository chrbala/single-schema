// @flow

import reduce from './reduce';
import array from './array';
import map from './map';
import and from './and';
import maybe from './maybe';

import type { FlattenerType } from '../../shared/types';
import type { OptionsType } from './reduce';

type ValidatorType = (options: *) => FlattenerType<*>;

const Validator: ValidatorType = 
	({cache = false}: OptionsType = {}) => ({
		reduce: reduce({cache}),
		array,
		map,
		and,
		maybe,
	});

export default Validator;
