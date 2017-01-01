// @flow

import { GraphQLInt } from 'graphql';

import { combineReducers, and } from 'src/';
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
	and(string, longerThan(0), shorterThan(15)
), common);

export const pointer = combineReducers({
	id: string,
});
export const node = pointer;
