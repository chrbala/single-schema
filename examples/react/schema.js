// @flow

import { combineReducers, array } from 'examples/setup';
import { string } from 'examples/schema';

export const person = combineReducers({
	name: string,
});

export const people = array(person);

export const family = combineReducers({
	adults: people,
	children: people,
});
