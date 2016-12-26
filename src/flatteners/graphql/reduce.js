// @flow

import { NAME } from './types';
import type { ByNameType } from './types';
import type { AllReducerType } from '../../shared/types';

export default (children: AllReducerType) => {
	let name;
	let hasBeenSet = false;

	return () => {
		const getName = () => {
			if (!hasBeenSet)
				throw new Error('Value has not been set');
			return name;
		};
		const register = (_name: string) => {
			if (hasBeenSet)
				throw new Error('Can only set register graphql objects once');
			hasBeenSet = true;

			name = _name;
		};
		const getChildren = () => children;

		const out: ByNameType = {
			type: NAME,
			getName,
			register,
			getChildren,
			wrappers: [],
		};

		return out;
	};
};
