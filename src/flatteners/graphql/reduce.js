// @flow

import { NAME } from './types';
import type { ByNameType, InitialConfigType, VariationType } from './types';
import type { AllReducerType } from '../../shared/types';
import Instantiator from './instantiator';

export default (config: InitialConfigType) => 
	(children: AllReducerType, context: *) => {
		const names: {[key: VariationType]: ?string} = {
			input: undefined,
			output: undefined,
		};

		const getName = (type: VariationType) => {
			if (!names[type])
				throw new Error('Value has not been set');
			return names[type];
		};
		const register = (name: string, type: VariationType) => {
			if (names[type])
				throw new Error('Can only set register graphql objects once');

			names[type] = name;
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

			const [type, graphqlConfig] = args;
			Instantiator(config)(out)(type, graphqlConfig);
			return context;
		};
	};
