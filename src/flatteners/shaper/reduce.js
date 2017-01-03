// @flow

import { freeze } from '../../util/micro';

import type { AllReducerType } from '../../shared/types';

export default () => 
	(children: AllReducerType) => () => {
		const out = {};
		for (const key in children) {
			const child = children[key];
			const value = child && child();
			if (value !== undefined)
				out[key] = value;
		}
		return freeze(out);
	}
;
