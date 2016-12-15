// @flow

import type { AllFlattenerType, ReducerType, AnyFnType} from './shared/types';

export default (operator: string) => 
	(flatteners: AllFlattenerType) => (reducer: ReducerType<*>) => {
		const out: {[key: $Keys<typeof flatteners>]: AnyFnType} = {};
		for (const flattenerName in flatteners)
			out[flattenerName] = flatteners[flattenerName][operator](reducer[flattenerName]);
		return out;
	};
