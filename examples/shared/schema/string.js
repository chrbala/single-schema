// @flow

import { GraphQLString } from 'graphql';

export const string = {
	validate: (value: *) => typeof value == 'string'
		? null
		: `Expected string, got ${typeof value}`,
	coerce: (value: *) => String(value),
};

export const longerThan = (minLength: number) => ({
	validate: ({length}: string | Array<*>) => length > minLength
		? null
		: `Expected length greater than ${minLength}, got ${length}`,
});

export const shorterThan = (maxLength: number) => ({
	validate: ({length}: string | Array<*>) => length < maxLength
		? null
		: `Expected length less than ${maxLength}, got ${length}`,
	coerce: (value: string) => value.slice(0, maxLength - 1),
});

export const common = {
	shape: () => '',
	graphql: () => GraphQLString,
};
