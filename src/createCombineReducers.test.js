// @flow

import test from 'ava';
import Spy from './helpers/spy';

import createCombineReducers from './createCombineReducers';

test('createCombineReducers returns fn that creates the proper keys', t => {
	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: () => () => null,
		},
	}, {
		defaultFlattener: 'doSomething',
	});

	const reducers = combineReducers();

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
	}, {
		defaultFlattener: 'doSomething',
	});

	const { doSomething } = combineReducers();
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
	}, {
		defaultFlattener: 'doSomething',
	});

	t.is(spy1.timesRun(), 0);
	t.is(spy2.timesRun(), 0);

	const { doSomething } = combineReducers();
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
	}, {
		defaultFlattener: 'doSomething',
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
	}, {
		defaultFlattener: 'doSomething',
	});

	const { doSomething } = combineReducers({
		key: child,
	});
	doSomething();
});

test('Reducer is still run when child is missing a matching reducer', t => {
	t.plan(1);

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: ({key}) => () => t.is(key, undefined),
		},
	}, {
		defaultFlattener: 'doSomething',
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
	}, {
		defaultFlattener: 'doSomething',
	});

	const { doSomething } = combineReducers({
		key: null,
	});
	doSomething();
});

test('Reducer is provided the context of other reducers', t => {
	t.plan(2);

	const combineReducers = createCombineReducers({
		doSomething: {
			reduce: (_, context) => () => {
				t.deepEqual(Object.keys(context), ['doSomething', 'doSomethingElse']);
				t.is(context.doSomethingElse(), 5);
			},
		},
		doSomethingElse: {
			reduce: () => () => 5,
		},
	}, {
		defaultFlattener: 'doSomething',
	});

	const { doSomething } = combineReducers();
	doSomething();
});
