// @flow

import type { InputType, OutputType } from './types';
import { VALUE } from './types';

export const normalizeInput: (input: InputType) => OutputType = input => {
	// graphql objects are class instances
	if (input.constructor != {}.constructor) 
		return {
			type: VALUE,
			getValue: () => input,
			wrappers: [],
		};
	
	return input;
};
