// @flow

import PropTypes from './proptypes';

import { mapObj } from '../../util/micro';

import type { 
	AllReducerType, 
	ReducerType, 
} from '../../shared/types';

const reduce: ReducerType<*> = (children: AllReducerType<*>) => () => 
	PropTypes.shape(mapObj(children, child => child() || PropTypes.any))
;

export default reduce;
