// @flow

import { combineReducers, array, maybe } from 'examples/setup';
import { string, name } from 'examples/schema';

export const person = combineReducers({
	id: maybe(string),
	name,
});

export const people = array(person);

export const family = combineReducers({
	adults: people,
	children: people,
});
