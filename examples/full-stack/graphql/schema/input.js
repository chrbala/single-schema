// @flow

import { combine, array, maybe } from 'examples/setup';
import { name, pointer, string } from 'examples/schema';

pointer.graphql('input', {
	name: 'pointer',
});

const insertPerson = combine({
	name,
}).graphql('input', {
	name: 'insertPersonInput',
});

const updatePerson = combine({
	id: string,
	name,
}).graphql('input', {
	name: 'updatePersonInput',
});

combine({
	clientMutationId: maybe(string),
	person: updatePerson,
}).graphql('input', {
	name: 'updatePersonMutation',
});

combine({
	clientMutationId: maybe(string),
	person: insertPerson,
}).graphql('input', {
	name: 'insertPersonMutation',
});

const people = array(pointer);

const family = combine({
	id: maybe(string),
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
