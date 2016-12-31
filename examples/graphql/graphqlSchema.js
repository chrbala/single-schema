// @flow

import { 
	GraphQLObjectType,
	GraphQLSchema, 
	GraphQLNonNull,
	GraphQLString,
} from 'graphql';

import './schema';
import { store } from '../../src/defaultSelection';
import { schema } from '../database';
import { serialize } from '../shared/id';
import * as node from '../shared/node';

import type { ContextType, TableNameType } from '../shared/types';

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		node: {
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			type: store.get('node'),
			resolve: (_, args, context) => node.resolve(args, context),
		},
	},
});

const tableInsert = (table: TableNameType) => 
	(_, {input}, {database}: ContextType) => {
		const { coerce, validate } = schema[table];
		input = coerce(input);

		const error = validate(input);
		if (error)
			throw new Error(JSON.stringify(error));

		const id = database.update(table).push(input);
		return {
			...input,
			id: serialize({id, table}),
		};
	};

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
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
			resolve: tableInsert('family'),
		},
	},
});

export default new GraphQLSchema({
	query,
	mutation,
});
