// @flow

import type { ReducerType } from '../shared/types';

type OptionsType = {
	leafNode: *,
};
export default ({leafNode}: OptionsType) => ({
	reduce: (children: ReducerType<*>) => () => {
		const out = {};
		for (const key in children) {
			const child = children[key];
			out[key] = child ? child() : leafNode;
		}
		return out;
	},
});
