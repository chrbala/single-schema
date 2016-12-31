// @flow

import { combineReducers, array } from '../../../src';
import { name, pointer } from '../../shared/schema';

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
