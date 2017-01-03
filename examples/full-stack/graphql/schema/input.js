// @flow

import { combineReducers, array, maybe } from 'examples/setup';
import { name, pointer, string } from 'examples/schema';

pointer.graphql('input', {
	name: 'pointer',
});

combineReducers({
	clientMutationId: maybe(string),
	name,
}).graphql('input', {
	name: 'personInput',
});

const people = array(pointer);

combineReducers({
	clientMutationId: maybe(string),
	adults: people,
	children: people,
}).graphql('input', {
	name: 'familyInput',
});
