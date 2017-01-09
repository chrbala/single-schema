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

const insertFamily = combine({
	adults: people,
	children: people,
}).graphql('input', {
	name: 'insertFamilyInput',
});

const updateFamily = combine({
	id: string,
	adults: people,
	children: people,
}).graphql('input', {
	name: 'updateFamilyInput',
});

combine({
	clientMutationId: maybe(string),
	family: insertFamily,
}).graphql('input', {
	name: 'insertFamilyMutation',
});

combine({
	clientMutationId: maybe(string),
	family: updateFamily,
}).graphql('input', {
	name: 'updateFamilyMutation',
});
