// @flow

import { combine, array, maybe } from 'examples/setup';
import { name, pointer, string } from 'examples/schema';

pointer.graphql('input', {
	name: 'pointer',
});

const person = combine({
	name,
}).graphql('input', {
	name: 'personInput',
});

combine({
	clientMutationId: maybe(string),
	person,
}).graphql('input', {
	name: 'personMutation',
});

const people = array(pointer);

const family = combine({
	adults: people,
	children: people,
}).graphql('input', {
	name: 'familyInput',
});

combine({
	clientMutationId: maybe(string),
	family,
}).graphql('input', {
	name: 'familyMutation',
});
