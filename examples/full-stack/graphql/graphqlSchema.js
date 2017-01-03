// @flow

import { 
	GraphQLObjectType,
	GraphQLSchema, 
	GraphQLNonNull,
} from 'graphql';

import './schema';
import { store } from 'examples/setup';
import { schema } from 'examples/full-stack/database';
import { serialize } from 'examples/full-stack/shared/id';

import type { 
	ContextType, 
	TableNameType,
} from 'examples/full-stack/shared/types';

const tableInsert = (
	table: TableNameType, 
	validatePointers: (value: *, context: ContextType) => mixed = () => null,
) => 
	async (_, {input}, context: ContextType) => {
		const { clientMutationId } = input;
		let value = input[table];
		const { database } = context;
		const { coerce, validate } = schema[table];

		value = coerce(value);

		const error = validate(value);
		if (error)
			throw new Error(JSON.stringify(error));

		// this is important so invalid pointers are not put into
		// the database, resulting in an invalid state
		await validatePointers(value, context);

		const id = database.update(table).push(value) - 1;
		return {
			clientMutationId,
			[table]: {
				...value,
				id: serialize({id, table}),
			},
		};
	};

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: () => ({
		insertPerson: {
			type: new GraphQLNonNull(store.get('personPayload')),
			args: {
				input: { type: new GraphQLNonNull(store.get('personMutation')) },
			},
			resolve: tableInsert('person'),
		},
		insertFamily: {
			type: new GraphQLNonNull(store.get('familyPayload')),
			args: {
				input: { type: new GraphQLNonNull(store.get('familyMutation')) },
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
	query: store.get('query'),
	mutation,
});
