// @flow

import { GraphQLNonNull, GraphQLString } from 'graphql';
import { store } from 'examples/setup';
import { combine, array } from 'examples/setup';
import { name, string, node } from 'examples/schema';
import { isTypeOf } from 'examples/full-stack/graphql/node';

node.graphql('interface', {
	name: 'node',
});

const person = combine({
	id: string,
	name,
}).graphql('output', {
	name: 'person',
	interfaces: () => [ store.get('node') ],
	isTypeOf: isTypeOf('person'),
});

combine({
	clientMutationId: string,
	person,
}).graphql('output', {
	name: 'personPayload',
});

const people = array(person);

const family = combine({
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

combine({
	clientMutationId: string,
	family,
}).graphql('output', {
	name: 'familyPayload',
});

const queryAll = table => ({
	resolve: (_1, _2, {loaders}) => loaders[`${table}All`].load('*'),
});

const viewer = combine({
	personAll: array(person),
	familyAll: array(family),
}).graphql('output', {
	name: 'viewer',
	fields: {
		personAll: queryAll('person'),
		familyAll: queryAll('family'),
	},
});

combine({
	node,
	viewer,
}).graphql('output', {
	name: 'query',
	fields: () => ({
		node: {
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: (_, {id}, {loaders}) => loaders.node.load(id),
		},
		viewer: {
			resolve: () => ({}),
		},
	}),
});
