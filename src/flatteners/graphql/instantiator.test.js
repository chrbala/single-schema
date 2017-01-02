// @flow

import * as graphql from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import GraphQLFlattener from './';
import createStore from './createStore';

const string = {
	graphql: () => GraphQLString,
};

const getValue = value => JSON.parse(JSON.stringify(value));

it('Output test', () => {
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
	expect(NAME).toBe(grahpqlObject.name);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		label: { 
			type: 'String!', 
			isDeprecated: false, 
			name: 'label', 
			args: [],
		}, 
	};
	expect(actual).toEqual(expected);
});

it('Input test', () => {
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
	expect(NAME).toBe(grahpqlObject.name);

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		label: { 
			type: 'String!', 
			name: 'label', 
		}, 
	};
	expect(actual).toEqual(expected);
});

it('Shared input and output test', () => {
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

	expect(() => {
		store.get(OUTPUT_NAME);
		store.get(INPUT_NAME);
	}).not.toThrow();
});

it('Depth test', () => {
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
	expect(actual).toEqual(expected);
});
