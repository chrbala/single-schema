// @flow

import { 
	GraphQLObjectType,
	GraphQLSchema, 
	GraphQLNonNull,
} from 'graphql';

import './schema';
import { store } from 'examples/setup';
import { schema } from 'examples/full-stack/database';
import { serialize, deserialize } from 'examples/full-stack/shared/id';

import type { 
	ContextType, 
	TableNameType,
} from 'examples/full-stack/shared/types';

type MutationType = 'update' | 'insert';
const tableMutation = (
	table: TableNameType, 
	type: MutationType
) => 
	async (_, {input}, context: ContextType) => {
		const { clientMutationId } = input;
		let value = input[table];
		const { database } = context;
		const { coerce, validate, validateAsync } = schema[table];

		let { id } = value;
		value = coerce(value);

		const error = validate(value);
		if (error) 
			throw new Error(JSON.stringify(error));

		// this is important so invalid pointers are not put into
		// the database, resulting in an invalid state
		const asyncErr = await validateAsync(value, null, context);
		if (asyncErr)
			throw new Error(JSON.stringify(asyncErr));

		if (type == 'update') {
			const { id: index } = deserialize(id);
			if (!database.getState()[table][index])
				throw new Error('Invalid ID supplied');

			database.update(table)(index).set(value);
		} else {
			const index = database.update(table).push(value) - 1;
			id = serialize({id: index, table});
		}

		const node = {
			...value,
			id,
		};
		
		return {
			clientMutationId,
			node,
			edge: {
				cursor: id,
				node,
			},
		};
	};

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: () => ({
		insertPerson: {
			type: new GraphQLNonNull(store.get('insertPersonPayload')),
			args: {
				input: { type: new GraphQLNonNull(store.get('insertPersonMutation')) },
			},
			resolve: tableMutation('person', 'insert'),
		},
		updatePerson: {
			type: new GraphQLNonNull(store.get('updatePersonPayload')),
			args: {
				input: { type: new GraphQLNonNull(store.get('updatePersonMutation')) },
			},
			resolve: tableMutation('person', 'update'),
		},
		insertFamily: {
			type: new GraphQLNonNull(store.get('insertFamilyPayload')),
			args: {
				input: { type: new GraphQLNonNull(store.get('insertFamilyMutation')) },
			},
			resolve: tableMutation('family', 'insert'),
		},
		updateFamily: {
			type: new GraphQLNonNull(store.get('updateFamilyPayload')),
			args: {
				input: { type: new GraphQLNonNull(store.get('updateFamilyMutation')) },
			},
			resolve: tableMutation('family', 'update'),
		},
	}),
});

export default new GraphQLSchema({
	query: store.get('query'),
	mutation,
});
