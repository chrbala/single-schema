// @flow

import { combineReducers, array } from 'examples/setup';
import { name, pointer } from 'examples/schema';

pointer.graphql('input', {
	name: 'pointer',
});

combineReducers({
	name,
}).graphql('input', {
	name: 'personInput',
});

const people = array(pointer);

combineReducers({
	adults: people,
	children: people,
}).graphql('input', {
	name: 'familyInput',
});
