// @flow

import test from 'ava';

import * as graphqlLib from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import GraphQLFlattener from './';

test('Base test', t => {
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({graphql: graphqlLib}),
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
