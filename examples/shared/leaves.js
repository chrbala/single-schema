// @flow

import { GraphQLInt } from 'graphql';

import { and } from '../../src';
import { number, nonNaN, int, nonNegative } from './types/number';
import { string as stringType, shorterThan, common } from './types/string';

export const index = Object.assign(and(number, nonNaN, int, nonNegative), {
	shape: () => 0,
	graphql: () => GraphQLInt,
});

export const string = {
	...stringType,
	...common,
};

export const name = Object.assign(and(string, shorterThan(15)), common);
