// @flow

import test from 'ava';

import * as graphql from 'graphql';
import { GraphQLString, GraphQLObjectType } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import GraphQLFlattener from './';
import createStore from './createStore';

const getValue = value => JSON.parse(JSON.stringify(value));

const defaultVariation = {
	createName: rawName => rawName,
	/* eslint-disable flowtype/no-weak-types */
	build: (config: any) => new GraphQLObjectType(config),
	/* eslint-enable flowtype/no-weak-types */
	getChildName: name => name,
};

const string = {
	graphql: () => GraphQLString,
};

test('Base test', t => {
	const NAME = 'ArrayExample';

	const store = createStore();
	const flatteners = {
		graphql: GraphQLFlattener({
			graphql,
			variations: [defaultVariation],
			store,
		}),
	};
	const combineReducers = createCombineReducers(flatteners);
	const maybe = createMaybe(flatteners);

	combineReducers({
		key: maybe(string),
	}).graphql({
		name: NAME,
	});

	const grahpqlObject = store.get(NAME);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		key: { 
			type: 'String', 
			isDeprecated: false, 
			name: 'key', 
			args: [],
		}, 
	};
	t.deepEqual(actual, expected);
});

test.only('Recursive data structures', t => {
	const NAME = 'Node';

	const store = createStore();
	const flatteners = {
		graphql: GraphQLFlattener({
			graphql,
			variations: [defaultVariation],
			store,
		}),
	};
	const combineReducers = createCombineReducers(flatteners);
	const maybe = createMaybe(flatteners);
	
	const node = combineReducers(() => ({
		value: string,
		next: maybe(node),
	}));
	node.graphql({
		name: NAME,
	});

	const actual = getValue(store.get(NAME).getFields());
	const expected = {
	  value: {
	    type: 'String!',
	    isDeprecated: false,
	    name: 'value',
	    args: [],
	  },
	  next: {
	    type: 'Node',
	    isDeprecated: false,
	    name: 'next',
	    args: [],
	  },
	};

	t.deepEqual(actual, expected);
});
