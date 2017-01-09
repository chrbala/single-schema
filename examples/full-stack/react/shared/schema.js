// @flow

import { combine, array, maybe } from 'examples/setup';
import { string, name, pointer } from 'examples/schema';

export const person = combine({
	id: maybe(string),
	name,
});

export const people = array(person);

export const family = combine({
	id: maybe(string),
	adults: people,
	children: people,
});

export const familyInput = combine({
	id: maybe(string),
	adults: array(pointer),
	children: array(pointer),
});
