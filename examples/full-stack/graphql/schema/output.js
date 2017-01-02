// @flow

import { store } from 'examples/setup';
import { combineReducers, array } from 'examples/setup';
import { name, string, node } from 'examples/schema';
import { isTypeOf } from 'examples/full-stack/graphql/node';

node.graphql('interface', {
	name: 'node',
});

const person = combineReducers({
	id: string,
	name,
}).graphql('output', {
	name: 'person',
	interfaces: () => [ store.get('node') ],
	isTypeOf: isTypeOf('person'),
});

const people = array(person);

combineReducers({
	id: string,
	adults: people,
	children: people,
}).graphql('output', {
	name: 'family',
	interfaces: () => [ store.get('node') ],
	isTypeOf: isTypeOf('family'),
	fields: {
		adults: {
			resolve: ({adults}, _, {loaders}) => 
				adults.map(({id}) => loaders.node.load(id)),
		},
		children: {
			resolve: ({children}, _, {loaders}) => 
				children.map(({id}) => loaders.node.load(id)),
		},
	},
});
