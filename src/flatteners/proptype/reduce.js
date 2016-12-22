// @flow

import { createPropType } from './shared';

import type { ReducerType } from '../../shared/types';

const reduce: ReducerType<*> = (_, {validate}) => () => 
	createPropType(validate)
;

export default reduce;
