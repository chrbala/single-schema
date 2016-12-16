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
			const create = flatteners[flattenerName][operator];
			out[flattenerName] = create(...scopedReducers);
		}
		return out;
	};
