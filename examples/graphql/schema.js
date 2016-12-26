// @flow

import { GraphQLSchema } from 'graphql';

import { combineReducers } from '../../src';
import { person, family } from '../data';
import { store, instantiate } from './setup';

const exampleFamily = {
	adults: [ {name: 'Bob'}, {name: 'Susan'} ],
	children: [ {name: 'Larry'}, {name: 'Curly'}, {name: 'Moe'} ],
};

instantiate({
	name: 'person',
})(person);

instantiate({
	name: 'family',
})(family);

const query = combineReducers({
	family,
});
instantiate({
	name: 'query',
	fields: {
		family: {
			resolve: () => exampleFamily,
		},
	},
})(query);

export default new GraphQLSchema({
	query: store.get('query'),
});
