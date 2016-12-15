// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import Updater from './';

const combineReducers = createCombineReducers({
	createUpdate: Updater(),
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
	t.is(typeof update.key, 'function');
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

test('Can run an update on a key', t => {
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

test('Key updates immutably update objects', t => {
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

test('Can run a deep update', t => {
	t.plan(1);

	const { createUpdate } = combineReducers({
		key: combineReducers({
			deep: null,
		}),
	});

	const getState = () => ({});
	const subscribe = actual => {
		const expected = {
			key: {
				deep: 'hello',
			},
		};
		t.deepEqual(actual, expected);
	};
	const update = createUpdate({getState, subscribe});
	update.key.deep('hello');
});

test('Deep updates immutably update objects', t => {
	t.plan(1);

	const { createUpdate } = combineReducers({
		key: combineReducers({
			deep: null,
		}),
	});

	const state = {};
	const getState = () => state;
	const subscribe = actual => t.not(actual, state);
	const update = createUpdate({getState, subscribe});
	update.key.deep('hello');
});

test('Deep updates can be performed on missing object fragments', t => {
	t.plan(1);

	const { createUpdate } = combineReducers({
		key: combineReducers({
			deep: null,
		}),
	});

	const state = null;
	const getState = () => state;
	const subscribe = actual => {
		const expected = {
			key: {
				deep: 'hello',
			},
		};
		t.deepEqual(actual, expected);
	};
	const update = createUpdate({getState, subscribe});
	update.key.deep('hello');
});
