// @flow

import createLeaves from './createLeaves';

import { leaves as coerce } from './flatteners/coercer';
import { leaves as shape } from './flatteners/shaper';
import { leaves as validate } from './flatteners/validator';

export default createLeaves({
	coerce,
	shape,
	validate,
});
