// @flow

import { combineReducers, array } from '../../src';

const string = {
	coerce: value => String(value),
	validate: value => typeof value == 'string',
	shape: () => '',
};

export const person = combineReducers({
	name: string,
});

export const family = combineReducers({
	adults: array(person),
	children: array(person),
});
