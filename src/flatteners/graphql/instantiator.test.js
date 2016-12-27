// @flow

import test from 'ava';

import * as graphql from 'graphql';
import { GraphQLObjectType, GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import GraphQLFlattener from './';
import createStore from './createStore';

const string = {
	graphql: () => GraphQLString,
};

const getValue = value => JSON.parse(JSON.stringify(value));

const defaultVariation = {
	createName: rawName => rawName,
	/* eslint-disable flowtype/no-weak-types */
	build: (config: any) => new GraphQLObjectType(config),
	/* eslint-enable flowtype/no-weak-types */
	getChildName: name => name,
};

test('Basic test', t => {
	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			variations: [defaultVariation],
			store,
		}),
	});

	const NAME = 'NAME';

	combineReducers({
		label: string,
	}).graphql({
		name: NAME,
	});

	const grahpqlObject = store.get(NAME);
	t.is(NAME, grahpqlObject.name);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		label: { 
			type: 'String!', 
			isDeprecated: false, 
			name: 'label', 
			args: [],
		}, 
	};
	t.deepEqual(actual, expected);
});

test('Depth test', t => {
	const PARENT_NAME = 'PARENT';
	const CHILD_NAME = 'CHILD';
	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			variations: [defaultVariation],
			store,
		}),
	});

	const child = combineReducers({
		key: string,
		hello: string,
	}).graphql({
		name: CHILD_NAME,
	});

	combineReducers({
		child,
	}).graphql({
		name: PARENT_NAME,
	});

	const grahpqlObject = store.get(PARENT_NAME);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		child: { 
			type: `${CHILD_NAME}!`, 
			isDeprecated: false, 
			name: 'child', 
			args: [],
		}, 
	};
	t.deepEqual(actual, expected);
});

test('createName test', t => {
	t.plan(1);

	const NAME = 'NAME';
	const SUFFIX = 'SUFFIX';
	const COMBINED_NAME = `${NAME}${SUFFIX}`;
	
	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			variations: [defaultVariation],
			store,
		}),
	});

	combineReducers({
		label: string,
	}).graphql({
		name: NAME,
	});

	store.get(COMBINED_NAME);
});

test('getChildName test', t => {
	const PARENT_NAME = 'PARENT';
	const CHILD_NAME = 'CHILD';
	const toVariationName = name => `${name}_VARIATION`;

	const extraVariation = {
		createName: rawName => toVariationName(rawName),
		/* eslint-disable flowtype/no-weak-types */
		build: (config: any) => new GraphQLObjectType(config),
		/* eslint-enable flowtype/no-weak-types */
		getChildName: name => name,
	};

	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			variations: [defaultVariation, extraVariation],
			store,
		}),
	});

	const child = combineReducers({
		label: string,
	});
	child.graphql({
		name: CHILD_NAME,
	});

	combineReducers({
		child,
	}).graphql({
		name: PARENT_NAME,
	});

	const actual = getValue(store.get(PARENT_NAME).getFields());
	const expected = { 
		child: { 
			type: 'CHILD_VARIATION!',
			isDeprecated: false,
			name: 'child',
			args: [],
		},
	};

	t.deepEqual(actual, expected);
});

test.todo('Recursive data structures');
