// @flow

import test from 'ava';

import createCombineReducers from '../createCombineReducers';
import Updator from './updator';

const combineReducers = createCombineReducers({
	createUpdate: Updator(),
}, {
	defaultFlattener: 'createUpdate',
});

test('Update is the correct shape', t => {
	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => null;
	const subscribe = () => null;

	const update = createUpdate({getState, subscribe});
	t.is(typeof update, 'function');
	t.deepEqual(Object.keys(update), ['key']);
});

test('Can run a shallow update', t => {
	t.plan(1);

	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => ({});
	const data = {
		key: 'value',
	};
	const subscribe = actual => t.is(actual, data);
	const update = createUpdate({getState, subscribe});
	update(data);
});

test('Can run a deep update', t => {
	t.plan(1);

	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => ({});
	const subscribe = actual => {
		const expected = {
			key: 'hello',
		};
		t.deepEqual(actual, expected);
	};
	const update = createUpdate({getState, subscribe});
	update.key('hello');
});

test('Deep updates immutably update objects', t => {
	t.plan(1);

	const { createUpdate } = combineReducers({
		key: null,
	});

	const state = {};
	const getState = () => state;
	const subscribe = actual => {
		t.not(actual, state);
	};
	const update = createUpdate({getState, subscribe});
	update.key('hello');
});
