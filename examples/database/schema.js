// @flow

import { combineReducers, array } from '../../src';
import { name, index, string } from '../shared/leaves';

export const person = combineReducers({
	id: string, // this is bogus
	name,
});

export const node = combineReducers({
	id: index,
});

export const people = array(node);

export const family = combineReducers({
	adults: people,
	children: people,
});

export const database = combineReducers({
	person: array(person),
	family: array(family),
});
