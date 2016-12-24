// @flow

import test from 'ava';

import { GraphQLObjectType } from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import Instantiator from './instantiator';
import GraphQLFlattener from './';

const createStore = () => {
	const thunks = {};
	const values = {};
	
	const set = (name, value) => thunks[name] = value;
	const get = name => {
		if (!values[name])
			values[name] = thunks[name]();
		return values[name];
	};
	
	return {
		set,
		get,
	};
};

const combineReducers = createCombineReducers({
	graphql: GraphQLFlattener(),
});

const string = {
	graphql: () => GraphQLString,
};

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
	});

	const register = instantiate({
		name: NAME,
	});
	register(combineReducers({
		label: string,
	}));

	const grahpqlObject = store.get(NAME);
	t.is(NAME, grahpqlObject.name);

	const getValue = value => JSON.parse(JSON.stringify(value));

	const actual = getValue(grahpqlObject.getFields());
	const expected = { 
		label: { 
			type: 'String', 
			isDeprecated: false, 
			name: 'label', 
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
	});

	const register = instantiate({
		name: NAME,
	});
	register(combineReducers({
		label: string,
	}));

	store.get(COMBINED_NAME);
});
