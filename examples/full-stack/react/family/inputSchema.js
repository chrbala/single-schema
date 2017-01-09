// @flow

import { combine, array, maybe } from 'examples/setup';
import { string } from 'examples/schema';

const pointer = combine({
	id: string,
});

const people = array(pointer);

export const familyInput = combine({
	id: maybe(string),
	adults: people,
	children: people,
});
