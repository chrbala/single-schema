// @flow

import { 
	GraphQLObjectType,
	GraphQLSchema, 
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
} from 'graphql';

import './schema';
import { store } from 'examples/setup';
import { schema } from 'examples/full-stack/database';
import { serialize } from 'examples/full-stack/shared/id';

import type { 
	ContextType, 
	TableNameType,
} from 'examples/full-stack/shared/types';

const queryAll = table => ({
	type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(
		store.get(table)
	))),
	resolve: (_1, _2, {loaders}) => loaders[`${table}All`].load('*'),
});

const query = new GraphQLObjectType({
	name: 'query',
	fields: () => ({
		node: {
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			type: store.get('node'),
			resolve: (_, {id}, {loaders}) => loaders.node.load(id),
		},
		personAll: queryAll('person'),
		familyAll: queryAll('family'),
	}),
});

const tableInsert = (
	table: TableNameType, 
	validatePointers: (value: *, context: ContextType) => mixed = () => null,
) => 
	async (_, {input}, context: ContextType) => {
		const { database } = context;
		const { coerce, validate } = schema[table];
		input = coerce(input);

		const error = validate(input);
		if (error)
			throw new Error(JSON.stringify(error));

		// this is important so invalid pointers are not put into
		// the database, resulting in an invalid state
		await validatePointers(input, context);

		const id = database.update(table).push(input) - 1;
		return {
			...input,
			id: serialize({id, table}),
		};
	};

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: () => ({
		insertPerson: {
			type: new GraphQLNonNull(store.get('person')),
			args: {
				input: { type: new GraphQLNonNull(store.get('personInput')) },
			},
			resolve: tableInsert('person'),
		},
		insertFamily: {
			type: new GraphQLNonNull(store.get('family')),
			args: {
				input: { type: new GraphQLNonNull(store.get('familyInput')) },
			},
			resolve: tableInsert('family', ({adults, children}, {loaders}) => 
				loaders.node.loadMany(adults.concat(children).map(({id}) => id))
					.catch(e =>
						Promise.reject(`Error saving family: ${e.message}`)
					)
			),
		},
	}),
});

export default new GraphQLSchema({
	query,
	mutation,
});
