// @flow

import { 
	GraphQLObjectType,
	GraphQLSchema, 
	GraphQLInt, 
	GraphQLNonNull,
} from 'graphql';

import { store } from '../../src/defaultSelection';
import { person, family } from './schema';
import { update, schema, getState } from '../database';
import { deserialize } from '../shared/id';

person.graphql({
	name: 'person',
});

const resolveNode = serialized => {
	const { id, table } = deserialize(serialized);
	return {
		id: serialized,
		...getState()[table][id],
	};
};

family.graphql({
	name: 'family',
	fields: {
		adults: {
			resolve: ({adults}) => adults.map(resolveNode),
		},
		children: {
			resolve: ({children}) => children.map(resolveNode),
		},
	},
});

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		family: {
			type: store.get('family'),
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve: (_, {id}) => {
				const value = getState().family[id];
				if (!value)
					throw new Error(`Family ${id} does not exist`);
				return value;
			},
		},
	},
});

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		insertPerson: {
			type: store.get('person'),
			args: {
				input: { type: new GraphQLNonNull(store.get('personInput')) },
			},
			resolve: (_, {input}) => {
				input = schema.person.coerce(input);
				const error = schema.person.validate(input);
				if (error)
					throw new Error(JSON.stringify(error));

				update('person').push(input);
				return input;
			},
		},
		insertFamily: {
			type: store.get('family'),
			args: {
				input: { type: new GraphQLNonNull(store.get('familyInput')) },
			},
			resolve: (_, {input}) => {
				input = schema.family.coerced(input);

				const error = schema.family.validate(input);
				if (error)
					throw new Error(error);

				update('family').push(input);
				return input;
			},
		},
	},
});

export default new GraphQLSchema({
	query,
	mutation,
});
