// @flow

import { combine, array } from 'examples/setup';
import { pointer, name } from 'examples/schema';

export const person = combine({
	name,
});

export const people = array(pointer);

export const family = combine({
	adults: people,
	children: people,
});

export const database = combine({
	person: array(person),
	family: array(family),
});
