// @flow

import { createCombineReducers } from './createCombineReducers';
import { Validator, Coercer, Shaper } from './flatteners';

export const combineReducers = createCombineReducers({
	validate: Validator({cache: true}),
	coerce: Coercer({cache: true}),
	shape: Shaper(),
}, 'validate');
