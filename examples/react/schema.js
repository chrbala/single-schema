// @flow

import { combine, array } from 'examples/setup';
import { string } from 'examples/schema';

export const person = combine({
	name: string,
});

export const people = array(person);

export const family = combine({
	adults: people,
	children: people,
});
