// @flow

import test from 'ava';
import Spy from './helpers/spy';

import createCombineReducers from './createCombineReducers';

test('createCombineReducers returns fn that creates the proper keys', t => {
	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: () => () => null,
		},
	});

	const reducers = combineReducers({});

	const actual = Object.keys(reducers);
	const expected = ['doSomething'];

	t.deepEqual(actual, expected);
});

test('Reducer is passed in all the data', t => {
	t.plan(1);

	const inputData = {
		key: 'hi',
	};

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: () => data => t.deepEqual(data, inputData),
		},
	});

	const { doSomething } = combineReducers({});
	doSomething(inputData);
});

test('Only the relevant reducer is run', t => {
	const spy1 = Spy();
	const spy2 = Spy();

	const inputData = {
		key: 'hi',
	};

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: () => spy1,
		},
		doSomethingElse: {
			reduce: () => spy2,
		},
	});

	t.is(spy1.timesRun(), 0);
	t.is(spy2.timesRun(), 0);

	const { doSomething } = combineReducers({});
	doSomething(inputData);

	t.is(spy1.timesRun(), 1);
	t.is(spy2.timesRun(), 0);
});

test('Reducer is provided with its children when run', t => {
	t.plan(1);

	const child = () => () => null;

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: ({key}) => () => t.is(key, child),
		},
	});

	const { doSomething } = combineReducers({
		key: {
			doSomething: child,
		},
	});
	doSomething();
});

test('defaultFlattener assigns a function child to a flattener', t => {
	t.plan(1);

	const child = () => () => null;

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: ({key}) => () => t.is(key, child),
		},
	});

	const { doSomething } = combineReducers({
		key: {
			doSomething: child,
		},
	});
	doSomething();
});

test('Reducer is still run when child is missing a matching reducer', t => {
	t.plan(1);

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: ({key}) => () => t.is(key, undefined),
		},
	});

	const { doSomething } = combineReducers({
		key: {

		},
	});
	doSomething();
});

test('Reducer is still run when child is null', t => {
	t.plan(1);

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: ({key}) => () => t.is(key, null),
		},
	});

	const { doSomething } = combineReducers({
		key: null,
	});
	doSomething();
});

test('Reducer can have state', t => {
	let i = 0;

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: ({key}) => {
				i++;
				return () => t.is(key, null);
			},
		},
	});

	const { doSomething } = combineReducers({
		key: null,
	});

	doSomething();
	doSomething();

	t.is(i, 1);
});

test.todo('Can create cyclic types');

test('Reducer is provided the context of other reducers', t => {
	t.plan(2);

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: (_, context: {doSomethingElse: () => *}) => () => {
				t.deepEqual(Object.keys(context), ['doSomething', 'doSomethingElse']);
				t.is(context.doSomethingElse(), 5);
			},
		},
		doSomethingElse: {
			reduce: () => () => 5,
		},
	});

	const { doSomething } = combineReducers({});
	doSomething();
});
