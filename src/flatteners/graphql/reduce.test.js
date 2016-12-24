// @flow

import test from 'ava';

import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import GraphQLFlattener from './';

test('Sanity test', t => {
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener(),
	});

	const string = {
		graphql: () => GraphQLString,
	};

	const { graphql } = combineReducers({
		key: string,
	});

	const actual = graphql().key();
	const expected = GraphQLString;

	t.is(actual, expected);
});
