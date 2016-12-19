// @flow

import type { AllReducerType, ReducerType } from '../../shared/types';
import type { ScopeType } from './types';

const MISSING_KEY_ERROR = key => 
	`Attempted to access nonexistant key ${key}`;

const reduce: ReducerType<*> = (children: AllReducerType<*>) => 
	({subscribe: scopedSubscribe, getState: scopedGetstate}: ScopeType) => {
		const getState = key => () => {
			const scopedState = scopedGetstate();
			return scopedState === undefined || scopedState === null
				? scopedState
				: scopedState[key]
			;
		};
		const subscribe = key => data => 
			scopedSubscribe({...scopedGetstate(), [key]: data});

		const getChild = (key: string) => {
			if (!(key in children))
				throw new Error(MISSING_KEY_ERROR(key));

			const childStore = children[key] 
				? children[key] 
				: reduce({}, {})
			;

			return childStore({
				getState: getState(key), 
				subscribe: subscribe(key),
			});
		};

		const keys = () => Object.keys(children);

		return Object.assign(getChild, {
			keys, 
			set: scopedSubscribe, 
		});
	}
;

export default reduce;
