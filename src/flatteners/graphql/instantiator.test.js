// @flow

import test from 'ava';

import * as graphql from 'graphql';
import { GraphQLObjectType, GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import Instantiator from './instantiator';
import GraphQLFlattener from './';
import createStore from './createStore';

const combineReducers = createCombineReducers({
	graphql: GraphQLFlattener({graphql}),
});

const string = {
	graphql: () => GraphQLString,
};

const getValue = value => JSON.parse(JSON.stringify(value));

test('Basic test', t => {
	const NAME = 'NAME';
	const store = createStore();
	const instantiate = Instantiator({
		store,
		variations: [{
			createName: rawName => rawName,
			/* eslint-disable flowtype/no-weak-types */
			build: (config: any) => new GraphQLObjectType(config),
			/* eslint-enable flowtype/no-weak-types */
		}],
		graphql,
	});

	const register = instantiate({
		name: NAME,
	});
	register(combineReducers({
		label: string,
	}));

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
	const instantiate = Instantiator({
		store,
		variations: [{
			createName: rawName => rawName,
			/* eslint-disable flowtype/no-weak-types */
			build: (config: any) => new GraphQLObjectType(config),
			/* eslint-enable flowtype/no-weak-types */
		}],
		graphql,
	});

	const child = combineReducers({
		key: string,
		hello: string,
	});
	instantiate({
		name: CHILD_NAME,
	})(child);

	const registerParent = instantiate({
		name: PARENT_NAME,
	});
	registerParent(combineReducers({
		child,
	}));

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
	t.plan(1);

	const NAME = 'NAME';
	const SUFFIX = 'SUFFIX';
	const COMBINED_NAME = `${NAME}${SUFFIX}`;
	
	const store = createStore();
	const instantiate = Instantiator({
		store,
		variations: [{
			createName: rawName => rawName + SUFFIX,
			build: ({name}) => t.is(name, COMBINED_NAME),
		}],
		graphql,
	});

	const register = instantiate({
		name: NAME,
	});
	register(combineReducers({
		label: string,
	}));

	store.get(COMBINED_NAME);
});
