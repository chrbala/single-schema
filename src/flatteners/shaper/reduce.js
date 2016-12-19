// @flow

import { freeze } from '../../util/micro';

import type { AllReducerType } from '../../shared/types';

type OptionsType = {
	leafNode: *,
};
export default ({leafNode}: OptionsType) => 
	(children: AllReducerType<*>) => () => {
		const out = {};
		for (const key in children) {
			const child = children[key];
			const value = child && child();
			if (child) {
				if (value !== undefined)
					out[key] = value;
			} else
				out[key] = leafNode;
		}
		return freeze(out);
	}
;
