// @flow

import test from 'ava';

import * as graphqlLib from 'graphql';
import { GraphQLObjectType } from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import GraphQLFlattener from './';
import createStore from './createStore';

const defaultVariation = {
	createName: rawName => rawName,
	/* eslint-disable flowtype/no-weak-types */
	build: (config: any) => new GraphQLObjectType(config),
	/* eslint-enable flowtype/no-weak-types */
	getChildName: name => name,
};

test('Base test', t => {
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql: graphqlLib,
			variations: [defaultVariation],
			store: createStore(),
		}),
	});

	const string = {
		graphql: () => GraphQLString,
	};

	const { graphql } = combineReducers({
		key: string,
	});

	const actual = graphql().getChildren().key();
	const expected = GraphQLString;

	t.is(actual, expected);
});

test('Fields can host their own config', t => {
	const PARENT_NAME = 'PARENT';
	const CHILD_NAME = 'CHILD';

	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql: graphqlLib,
			variations: [defaultVariation],
			store,
		}),
	});

	const string = {
		graphql: () => GraphQLString,
	};

	const child = combineReducers({
		key: string,
	});
	child.graphql({
		name: CHILD_NAME,
	}, {
		resolve: () => 'hi',
	});

	combineReducers({
		child,
	}).graphql({
		name: PARENT_NAME,
	});

	const actual = store.get(PARENT_NAME).getFields().child.resolve();
	const expected = 'hi';
	t.is(actual, expected);
});

test('Field config overrides parent config', t => {
	const PARENT_NAME = 'PARENT';
	const CHILD_NAME = 'CHILD';

	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql: graphqlLib,
			variations: [defaultVariation],
			store,
		}),
	});

	const string = {
		graphql: () => GraphQLString,
	};

	const child = combineReducers({
		key: string,
	});
	child.graphql({
		name: CHILD_NAME,
	}, {
		resolve: () => 'hi',
	});

	combineReducers({
		child,
	}).graphql({
		name: PARENT_NAME,
		fields: {
			child: {
				resolve: () => 'NOPE!',
			},
		},
	});

	const actual = store.get(PARENT_NAME).getFields().child.resolve();
	const expected = 'hi';
	t.is(actual, expected);
});
