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
