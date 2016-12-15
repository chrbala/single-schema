// @flow

import type { AllFlattenerType, ReducerType, AnyFnType} from './shared/types';

export default (operator: string) => 
	(flatteners: AllFlattenerType) => (...reducers: Array<ReducerType<*>>) => {
		const out: {[key: $Keys<typeof flatteners>]: AnyFnType} = {};
		for (const flattenerName in flatteners) {
			const scopedReducers = 
				reducers
					.map(reducer => reducer[flattenerName])
					.reduce(
						(acc, next) => (next && acc.push(next), acc)
					, [])
			;
			out[flattenerName] = flatteners[flattenerName][operator](...scopedReducers);
		}
		return out;
	};
