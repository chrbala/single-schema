// @flow

import * as graphql from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import GraphQLFlattener from './';
import createStore from './createStore';

const getValue = value => JSON.parse(JSON.stringify(value));

const string = {
	graphql: () => GraphQLString,
};

it('Base test', () => {
	const NAME = 'ArrayExample';

	const store = createStore();
	const flatteners = {
		graphql: GraphQLFlattener({
			graphql,
			store,
		}),
	};
	const combineReducers = createCombineReducers(flatteners);
	const maybe = createMaybe(flatteners);

	combineReducers({
		key: maybe(string),
	}).graphql('output', {
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
	expect(actual).toEqual(expected);
});

it('Recursive data structures', () => {
	const NAME = 'Node';

	const store = createStore();
	const flatteners = {
		graphql: GraphQLFlattener({
			graphql,
			store,
		}, 'output'),
	};
	const combineReducers = createCombineReducers(flatteners);
	const maybe = createMaybe(flatteners);
	
	const node = combineReducers(() => ({
		value: string,
		next: maybe(node),
	}));
	node.graphql('output', {
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

	expect(actual).toEqual(expected);
});
