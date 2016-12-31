// @flow

import { combineReducers, array } from '../../src';
import { pointer, name } from '../shared/schema';

export const person = combineReducers({
	name,
});

export const people = array(pointer);

export const family = combineReducers({
	adults: people,
	children: people,
});

export const database = combineReducers({
	person: array(person),
	family: array(family),
});
