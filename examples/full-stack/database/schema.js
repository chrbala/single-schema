// @flow

import { combine, array } from 'examples/setup';
import { name, pointer as genericPointer } from 'examples/schema';

export const pointer = {
	...genericPointer,
	validateAsync: ({id}, _, {loaders}) => loaders.node.load(id)
		.then(() => null)
		.catch(e => e.message),
};

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
