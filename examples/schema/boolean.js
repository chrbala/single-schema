// @flow

import { GraphQLBoolean } from 'graphql';

export const boolean = {
	validate: (value: *) => typeof value == 'boolean'
		? null
		: `Expected boolean, got ${typeof value}`,
	coerce: (value: *) => Boolean(value),
	graphql: () => GraphQLBoolean,
	shape: () => false,
};
