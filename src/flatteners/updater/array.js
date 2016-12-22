// @flow

import { mapObj } from '../../util/micro';

import get, * as arrayOps from './arrayOps';

import type { ScopeType } from './types';

type ChildType = (scope: ScopeType) => (...args: Array<*>) => void;
export default (child: ?ChildType) => (context: {}) => () =>
	// flow does not like Object.assign to be used like this
	// $FlowFixMe
	({subscribe, getState}: ScopeType) => Object.assign(
		get({
			subscribe, 
			getState, 
			child, 
			context,
		}), {
			set: subscribe, 
		}, mapObj(arrayOps, op => op({
			subscribe, 
			getState, 
			child, 
			context,
		}))
	)
;
