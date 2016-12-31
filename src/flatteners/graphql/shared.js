// @flow

import type { 
	InputType, 
	OutputType, 
	VariationType, 
	StoredTypesType,
} from './types';
import { VALUE } from './types';

type VariationToStoredType = (variation: VariationType) => StoredTypesType;
export const variationToStored: VariationToStoredType = variation => {
	if (variation === 'interface')
		return 'output';
	return variation;
};

export const normalizeInput: (input: InputType) => OutputType = input => {
	// graphql objects are class instances
	if (input.constructor != {}.constructor) 
		return {
			type: VALUE,
			getValue: () => input,
			wrappers: [],
			getFieldConfig: () => ({}),
		};
	
	return input;
};
