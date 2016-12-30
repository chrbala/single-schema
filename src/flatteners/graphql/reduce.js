// @flow

import { NAME } from './types';
import type { ByNameType, InitialConfigType } from './types';
import type { AllReducerType } from '../../shared/types';
import Instantiator from './instantiator';

export default (config: InitialConfigType) => (children: AllReducerType) => {
	let name;
	let hasBeenSet = false;

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

	return (...args: Array<*>) => {
		if (!args.length)
			return out;

		const [graphqlConfig] = args;
		Instantiator(config)(out)(graphqlConfig);
	};
};
