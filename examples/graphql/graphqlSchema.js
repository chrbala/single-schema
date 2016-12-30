// @flow

import { 
	GraphQLObjectType,
	GraphQLSchema, 
	GraphQLNonNull,
	GraphQLString,
} from 'graphql';

import './schema';
import { store } from '../../src/defaultSelection';
import { update, schema } from '../database';
import { serialize } from '../shared/id';
import * as node from '../shared/node';

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		node: {
			args: {
				id: { type: GraphQLString },
			},
			type: store.get('node'),
			resolve: (_, args) => node.resolve(args),
		},
	},
});

const tableInsert = (table: string) => (_, {input}) => {
	const { coerce, validate } = schema[table];
	input = coerce(input);

	const error = validate(input);
	if (error)
		throw new Error(JSON.stringify(error));

	const id = update(table).push(input);
	return {
		...input,
		id: serialize({id, table}),
	};
};

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		insertPerson: {
			type: store.get('person'),
			args: {
				input: { type: new GraphQLNonNull(store.get('personInput')) },
			},
			resolve: tableInsert('person'),
		},
		insertFamily: {
			type: store.get('family'),
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
