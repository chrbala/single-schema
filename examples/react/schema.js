// @flow

import { combineReducers, array } from '../../src';
import { string } from '../shared/leaves';

export const person = combineReducers({
	name: string,
});

export const people = array(person);

export const family = combineReducers({
	adults: people,
	children: people,
});
