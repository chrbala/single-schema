// @flow

import { combineReducers, array } from '../../src';

const string = {
	validate: value => typeof value == 'string'
		? null
		: `Expected string, got ${typeof value}`,
	shape: () => '',
};

export const person = combineReducers({
	name: string,
});

export const people = array(person);

export const family = combineReducers({
	adults: people,
	children: people,
});
