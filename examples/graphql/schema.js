// @flow

import { GraphQLSchema } from 'graphql';

import { combineReducers } from '../../src';
import { person, family } from '../data';
import { store } from './setup';

const exampleFamily = {
	adults: [ {name: 'Bob'}, {name: 'Susan'} ],
	children: [ {name: 'Larry'}, {name: 'Curly'}, {name: 'Moe'} ],
};

person.graphql({
	name: 'person',
});

family.graphql({
	name: 'family',
});

combineReducers({
	family,
}).graphql({
	name: 'query',
	fields: {
		family: {
			resolve: () => exampleFamily,
		},
	},
});

export default new GraphQLSchema({
	query: store.get('query'),
});
