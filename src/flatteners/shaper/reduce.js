// @flow

import type { AllReducerType } from '../../shared/types';

type OptionsType = {
	leafNode: *,
};
export default ({leafNode}: OptionsType) => 
	(children: AllReducerType<*>) => () => {
		const out = {};
		for (const key in children) {
			const child = children[key];
			out[key] = child ? child() : leafNode;
		}
		return out;
	}
;
