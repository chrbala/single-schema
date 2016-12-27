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
	});
	child.graphql({
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
	const NAME = 'NAME';
	const toVariationName = name => `${name}_VARIATION`;
	
	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			variations: [{
				createName: rawName => toVariationName(rawName),
				/* eslint-disable flowtype/no-weak-types */
				build: (config: any) => new GraphQLObjectType(config),
				/* eslint-enable flowtype/no-weak-types */
				getChildName: name => name,
			}],
			store,
		}),
	});

	combineReducers({
		label: string,
	}).graphql({
		name: NAME,
	});

	const actual = getValue(store.get(toVariationName(NAME)).getFields());
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

test('getChildName test', t => {
	const PARENT_NAME = 'PARENT';
	const CHILD_NAME = 'CHILD';
	const toVariationName = name => `${name}_VARIATION`;

	const parentVariation = {
		createName: rawName => rawName,
		/* eslint-disable flowtype/no-weak-types */
		build: (config: any) => new GraphQLObjectType(config),
		/* eslint-enable flowtype/no-weak-types */
		getChildName: name => toVariationName(name),
	};

	const childVariation = {
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
			variations: [parentVariation, childVariation],
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
