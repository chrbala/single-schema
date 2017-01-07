// @flow

import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { store } from 'examples/setup';
import { combine, array } from 'examples/setup';
import { name, string, node, boolean } from 'examples/schema';
import { isTypeOf } from 'examples/full-stack/graphql/node';
import { serialize, deserialize } from 'examples/full-stack/shared/id';

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

const pageInfo = combine({
	hasPreviousPage: boolean,
	hasNextPage: boolean,
}).graphql('output', {
	name: 'PageInfo',
});

const personEdge = combine({
	node: person,
}).graphql('output', {
	name: 'personEdge',
});

const personConnection = combine({
	edges: array(personEdge),
	pageInfo,
}).graphql('output', {
	name: 'personConnection',
});

const familyEdge = combine({
	node: family,
}).graphql('output', {
	name: 'familyEdge',
});

const familyConnection = combine({
	edges: array(familyEdge),
	pageInfo,
}).graphql('output', {
	name: 'familyConnection',
});

combine({
	clientMutationId: string,
	person,
}).graphql('output', {
	name: 'personPayload',
});

type PaginationArgType = {
	first: number,
	last: number,
	before: string,
	after: string,
};
const queryAll = table => ({
	args: {
		first: {type: GraphQLInt },
		last: {type: GraphQLInt },
		before: {type: GraphQLString },
		after: {type: GraphQLString },
	},
	resolve: (_, {first, last, before, after}: PaginationArgType, {database}) => {
		if (first < 0 || last < 0 || (first && last))
			throw new Error('Invalid request');
		
		const parsedAfter = after 
			? deserialize(after) 
			: { id: 0, table }
		;
		const parsedBefore = before 
			? deserialize(before) 
			: { id: Number.MAX_SAFE_INTEGER, table }
		;

		if (parsedAfter.table != table || parsedBefore.table != table)
			throw new Error('Invalid request');

		const min = parsedAfter.id;
		const max = parsedBefore.id;

		const state = database.getState()[table];
		const edges = state
			.slice(min, max)
			.map((_person, i) => ({node: {
				..._person,
				id: serialize({id: min + i, table}),
			}}))
		;
		const PageInfo = {
			hasNextPage: !!first && max < state.length,
			hasPreviousPage: !!last && min > 0,
		};
		return {
			edges,
			PageInfo,
		};
	},
});

const viewer = combine({
	personAll: personConnection,
	familyAll: familyConnection,
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
