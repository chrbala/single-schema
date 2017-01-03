// @flow

import { createPropType } from './shared';

import type { ReducerType } from '../../shared/types';

type LocalOptionsType = {
	ignore?: Array<string>,
};
const reduce: ReducerType<*> = (_, {validate}) => 
	(options: LocalOptionsType) => 
		createPropType(validate, options)
	;

export default reduce;
