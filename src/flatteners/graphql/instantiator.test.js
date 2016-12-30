// @flow

import test from 'ava';

import * as graphql from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import GraphQLFlattener from './';
import createStore from './createStore';

const string = {
	graphql: () => GraphQLString,
};

const getValue = value => JSON.parse(JSON.stringify(value));

test('Output test', t => {
	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			store,
		}),
	});

	const NAME = 'NAME';

	combineReducers({
		label: string,
	}).graphql('output', {
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

test('Input test', t => {
	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			store,
		}),
	});

	const NAME = 'NAME';

	combineReducers({
		label: string,
	}).graphql('input', {
		name: NAME,
	});

	const grahpqlObject = store.get(NAME);
	t.is(NAME, grahpqlObject.name);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		label: { 
			type: 'String!', 
			name: 'label', 
		}, 
	};
	t.deepEqual(actual, expected);
});

test('Shared input and output test', t => {
	const OUTPUT_NAME = 'Output';
	const INPUT_NAME = 'Input';

	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			store,
		}),
	});

	combineReducers({
		label: string,
	}).graphql('output', {
		name: OUTPUT_NAME,
	}).graphql('input', {
		name: INPUT_NAME,
	});

	t.notThrows(() => {
		store.get(OUTPUT_NAME);
		store.get(INPUT_NAME);
	});
});

test('Depth test', t => {
	const PARENT_NAME = 'PARENT';
	const CHILD_NAME = 'CHILD';
	const store = createStore();
	const combineReducers = createCombineReducers({
		graphql: GraphQLFlattener({
			graphql,
			store,
		}),
	});

	const child = combineReducers({
		key: string,
		hello: string,
	});
	child.graphql('output', {
		name: CHILD_NAME,
	});

	combineReducers({
		child,
	}).graphql('output', {
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
