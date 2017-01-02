// @flow

import * as graphqlLib from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import GraphQLFlattener from './';
import createStore from './createStore';

it('Base test', () => {
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql: graphqlLib,
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

	expect(actual).toBe(expected);
});
