// @flow

import arrayOrMap from './arrayOrMap';

import type { ScopeType } from './types';

type ChildType = (scope: ScopeType) => (...args: Array<*>) => void;
export default (child: ?ChildType) => (context: {}) => () =>
	// flow does not like Object.assign to be used like this
	// $FlowFixMe
	({subscribe, getState}: ScopeType) => Object.assign(
		arrayOrMap('MAP')({
			subscribe, 
			getState, 
			child, 
			context,
		}), {
			set: subscribe, 
		}
	)
;
