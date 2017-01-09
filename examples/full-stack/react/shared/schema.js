// @flow

import { combine, array, maybe } from 'examples/setup';
import { string, name } from 'examples/schema';

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
