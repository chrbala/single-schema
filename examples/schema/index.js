// @flow

import { GraphQLInt } from 'graphql';

import { combine, and } from 'examples/setup';
import { number, nonNaN, int, nonNegative } from './number';
import { 
	string as stringType, 
	shorterThan, 
	longerThan, 
	common,
} from './string';

export const index = Object.assign(and(number, nonNaN, int, nonNegative), {
	shape: () => 0,
	graphql: () => GraphQLInt,
});

export const string = {
	...stringType,
	...common,
};

export const name = Object.assign(
	and(string, longerThan(0), shorterThan(15)), 
	common,
);

const id = Object.assign(
	and(string, longerThan(0)),
	common,
);
export const pointer = combine({
	id,
});
export const node = pointer;

export { boolean } from './boolean';
