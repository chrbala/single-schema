// @flow

import { combineReducers, array } from '../../src';
import leaves from '../../src/defaultLeaves';

export const person = combineReducers({
	name: leaves.string,
});

export const people = array(person);

export const family = combineReducers({
	adults: people,
	children: people,
});
