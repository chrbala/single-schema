// @flow

import { combineReducers, array } from 'src/';
import { string } from 'examples/schema';

export const person = combineReducers({
	id: string,
	name: string,
});

export const people = array(person);

export const family = combineReducers({
	adults: people,
	children: people,
});
