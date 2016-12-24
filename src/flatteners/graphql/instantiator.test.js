// @flow

import test from 'ava';

import * as graphql from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import Instantiator from './instantiator';
import GraphQLFlattener from './';

const instantiate = Instantiator({graphql});

const combineReducers = createCombineReducers({
	graphql: GraphQLFlattener(),
});

const string = {
	graphql: () => GraphQLString,
};

test('Basic test', t => {
	const NAME = 'NAME';
	const toGraphql = instantiate({
		name: NAME,
	});
	const { GraphQLObjectType } = toGraphql(combineReducers({
		label: string,
	}));

	const grahpqlObject = GraphQLObjectType();
	t.is(NAME, grahpqlObject.name);

	const getValue = value => JSON.parse(JSON.stringify(value));

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		label: { 
			type: 'String', 
			isDeprecated: false, 
			name: 'label', 
			args: [],
		}, 
	};
	t.deepEqual(actual, expected);
});
