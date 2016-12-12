// @flow

import type { 
	ReducerType, 
} from '../shared/types';

type ScopeType = {
	subscribe: (newState: {}) => mixed,
	getState: () => {},
};

const Updator = () => 
	(children: ReducerType<*>) => 
		({subscribe: scopedSubscribe, getState: scopedGetstate}: ScopeType) => {
			const update = (value: {}) => scopedSubscribe(value);
			for (const child in children) {
				const getState = () => scopedGetstate()[child];
				const subscribe = data => {
					const newState = {...scopedGetstate(), [child]: data};
					scopedSubscribe(newState);
				};
				const childStore = children[child] 
					? children[child] 
					: Updator()({})
				;
				update[child] = childStore({getState, subscribe});
			}
			return update;
		};

export default Updator;
