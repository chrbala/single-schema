// @flow

import { mapObj } from '../../util/micro';

import * as arrayOps from './arrayOps';

import type { ScopeType } from './types';

type ChildType = (scope: ScopeType) => (...args: Array<*>) => void;
export default (child: ?ChildType) => (context: {}) => () =>
	({subscribe, getState}: ScopeType) => Object.assign({
		set: subscribe, 
	}, mapObj(arrayOps, op => op({
		subscribe, 
		getState, 
		child, 
		context,
	})))
;
