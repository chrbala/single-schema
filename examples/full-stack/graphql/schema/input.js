// @flow

import { combineReducers, array, maybe } from 'examples/setup';
import { name, pointer, string } from 'examples/schema';

pointer.graphql('input', {
	name: 'pointer',
});

const person = combineReducers({
	name,
}).graphql('input', {
	name: 'personInput',
});

combineReducers({
	clientMutationId: maybe(string),
	person,
}).graphql('input', {
	name: 'personMutation',
});

const people = array(pointer);

const family = combineReducers({
	adults: people,
	children: people,
}).graphql('input', {
	name: 'familyInput',
});

combineReducers({
	clientMutationId: maybe(string),
	family,
}).graphql('input', {
	name: 'familyMutation',
});
