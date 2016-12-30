// @flow

import { combineReducers, array } from '../../src';
import { string, name } from '../shared/leaves';

export const person = combineReducers({
	id: string,
	name,
});

export const people = array(person);

export const family = combineReducers({
	adults: people,
	children: people,
});
