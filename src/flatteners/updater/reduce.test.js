// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import Updater from './';

const combineReducers = createCombineReducers({
	createUpdate: Updater(),
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
	update.set(data);
});

test('Can get keys', t => {
	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => ({});
	const subscribe = () => null;
	const update = createUpdate({getState, subscribe});
	const actual = update.keys();
	const expected = ['key'];
	t.deepEqual(actual, expected);
});

test('Can set a key value', t => {
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
	update('key').set('hello');
});

test('Setting keys immutably updates objects', t => {
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
	update('key').set('hello');
});

test('Can set deep keys', t => {
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
	update('key')('deep').set('hello');
});

test('Setting deep keys immutably updates objects', t => {
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
	update('key')('deep').set('hello');
});

test('Deep changes can be performed on missing object fragments', t => {
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
	update('key')('deep').set('hello');
});

test('Throws when unused key is accessed', t => {
	const { createUpdate } = combineReducers({});

	const getState = () => ({});
	const subscribe = () => null;
	const update = createUpdate({getState, subscribe});
	t.throws(() => update('key'));
});
