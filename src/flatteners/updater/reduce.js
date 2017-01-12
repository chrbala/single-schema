// @flow

import { freeze } from '../../util/micro';

import type { AllReducerType, ReducerType } from '../../shared/types';
import type { ScopeType } from './types';

const MISSING_KEY_ERROR = key => 
	`Attempted to access nonexistant key ${key}`;

const reduce: ReducerType<*> = (children: AllReducerType) => () =>
	({subscribe: scopedSubscribe, getState: scopedGetstate}: ScopeType) => {
		const getState = key => () => {
			const scopedState = scopedGetstate();
			return scopedState === undefined || scopedState === null
				? scopedState
				: scopedState[key]
			;
		};
		const subscribe = key => data => 
			scopedSubscribe(freeze({...scopedGetstate(), [key]: data}));

		const getChild = (key: string) => {
			if (!(key in children))
				throw new Error(MISSING_KEY_ERROR(key));

			const childStore = children[key] 
				? children[key]
				: reduce({})({reduce})
			;

			return childStore({
				getState: getState(key), 
				subscribe: subscribe(key),
			});
		};

		const keys = () => Object.keys(children);
		const deleteKey = keyToDelete => {
			const state = scopedGetstate();
			if (state === undefined || state === null)
				return;

			const out = {};
			for (const key in state)
				if (key != keyToDelete)
					out[key] = state[key];
			scopedSubscribe(freeze(out));
		};

		return Object.assign(getChild, {
			keys, 
			set: scopedSubscribe, 
			delete: deleteKey,
		});
	}
;

export default reduce;
