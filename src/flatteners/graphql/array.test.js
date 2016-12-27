// @flow

import test from 'ava';

import * as graphqlLib from 'graphql';
import { GraphQLString, GraphQLObjectType } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import { createArray } from '../../operators';
import GraphQLFlattener from './';
import createStore from './createStore';

const defaultVariation = {
	createName: rawName => rawName,
	/* eslint-disable flowtype/no-weak-types */
	build: (config: any) => new GraphQLObjectType(config),
	/* eslint-enable flowtype/no-weak-types */
	getChildName: name => name,
};

const getValue = value => JSON.parse(JSON.stringify(value));

const string = {
	graphql: () => GraphQLString,
};

test('Base test', t => {
	const NAME = 'ArrayExample';

	const store = createStore();
	const flatteners = {
		graphql: GraphQLFlattener({
			graphql: graphqlLib,
			variations: [defaultVariation],
			store,
		}),
	};
	const combineReducers = createCombineReducers(flatteners);
	const array = createArray(flatteners);

	combineReducers({
		key: array(string),
	}).graphql({
		name: NAME,
	});

	const grahpqlObject = store.get(NAME);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		key: { 
			type: '[String!]!', 
			isDeprecated: false, 
			name: 'key', 
			args: [],
		}, 
	};
	t.deepEqual(actual, expected);
});
