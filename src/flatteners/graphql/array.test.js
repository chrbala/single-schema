// @flow

import test from 'ava';

import * as graphqlLib from 'graphql';
import { GraphQLString, GraphQLObjectType } from 'graphql';

import Instantiator from './instantiator';
import createCombineReducers from '../../createCombineReducers';
import { createArray } from '../../operators';
import GraphQLFlattener from './';
import createStore from './createStore';

const getValue = value => JSON.parse(JSON.stringify(value));

test('Base test', t => {
	const NAME = 'ArrayExample';

	const flatteners = {
		graphql: GraphQLFlattener({graphql: graphqlLib}),
	};

	const combineReducers = createCombineReducers(flatteners);
	const array = createArray(flatteners);

	const store = createStore();
	const instantiate = Instantiator({
		store,
		variations: [{
			createName: rawName => rawName,
			/* eslint-disable flowtype/no-weak-types */
			build: (config: any) => new GraphQLObjectType(config),
			/* eslint-enable flowtype/no-weak-types */
		}],
	});

	const string = {
		graphql: () => GraphQLString,
	};

	const register = instantiate({
		name: NAME,
	});

	register(combineReducers({
		key: array(string),
	}));

	const grahpqlObject = store.get(NAME);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		key: { 
			type: '[String]', 
			isDeprecated: false, 
			name: 'key', 
			args: [],
		}, 
	};
	t.deepEqual(actual, expected);
});
