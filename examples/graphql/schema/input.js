// @flow

import { combineReducers, array } from '../../../src';
import { pointer, name } from '../../shared/types';

combineReducers({
	name,
}).graphql('input', {
	name: 'personInput',
});

pointer.graphql('input', {
	name: 'pointerInput',
});

const people = array(pointer);

combineReducers({
	adults: people,
	children: people,
}).graphql('input', {
	name: 'familyInput',
});
