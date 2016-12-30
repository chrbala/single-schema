// @flow

import { combineReducers, array } from '../../../src';
import { name, string, node } from '../../shared/types';
import { resolve } from '../../shared/node';

node.graphql('output', {
	name: 'node',
});

const person = combineReducers({
	id: string,
	name,
});

person.graphql('output', {
	name: 'person',
});

const people = array(person);

combineReducers({
	adults: people,
	children: people,
}).graphql('output', {
	name: 'family',
	fields: {
		adults: {
			resolve: ({adults}) => adults.map(resolve),
		},
		children: {
			resolve: ({children}) => children.map(resolve),
		},
	},
});
