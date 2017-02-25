// @flow

import createCombineReducers from '../../createCombineReducers';
import Updater from './';

const combineReducers = createCombineReducers({
	createUpdate: Updater(),
});

it('Can run a shallow update', () => {
	expect.assertions(1);

	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => ({});
	const data = {
		key: 'value',
	};
	const subscribe = actual => expect(actual).toBe(data);
	const update = createUpdate({getState, subscribe});
	update.set(data);
});

it('Can get keys', () => {
	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => ({});
	const subscribe = () => null;
	const update = createUpdate({getState, subscribe});
	const actual = update.keys();
	const expected = ['key'];
	expect(actual).toEqual(expected);
});

it('Can delete a key', () => {
	expect.assertions(1);

	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => ({
		key: 'value',
	});
	const subscribe = actual => expect(actual).toEqual({});
	const update = createUpdate({getState, subscribe});
	update.delete('key');
});

it('Can set a key value', () => {
	expect.assertions(1);

	const { createUpdate } = combineReducers({
		key: null,
	});

	const getState = () => ({});
	const subscribe = actual => {
		const expected = {
			key: 'hello',
		};
		expect(actual).toEqual(expected);
	};
	const update = createUpdate({getState, subscribe});
	update('key').set('hello');
});

it('Setting keys immutably updates objects', () => {
	expect.assertions(1);

	const { createUpdate } = combineReducers({
		key: null,
	});

	const state = {};
	const getState = () => state;
	const subscribe = actual => {
		expect(actual).not.toBe(state);
	};
	const update = createUpdate({getState, subscribe});
	update('key').set('hello');
});

it('Can set deep keys', () => {
	expect.assertions(1);

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
		expect(actual).toEqual(expected);
	};
	const update = createUpdate({getState, subscribe});
	update('key')('deep').set('hello');
});

it('Subscribe includes path and value', () => {
	expect.assertions(2);

	const { createUpdate } = combineReducers({
		key: combineReducers({
			deep: null,
		}),
	});

	const getState = () => ({});
	const subscribe = (_, path, value) => {
		expect(path).toEqual(['key', 'deep']);
		expect(value).toEqual('hello');
	};
	const update = createUpdate({getState, subscribe});
	update('key')('deep').set('hello');
});

it('Path and value can be in a mid-level of the state', () => {
	expect.assertions(2);

	const { createUpdate } = combineReducers({
		key: combineReducers({
			deep: null,
		}),
	});

	const getState = () => ({});
	const subscribe = (_, path, value) => {
		expect(path).toEqual(['key']);
		expect(value).toEqual({deep: 'hello'});
	};
	const update = createUpdate({getState, subscribe});
	update('key').set({deep: 'hello'});
});

it('Setting deep keys immutably updates objects', () => {
	expect.assertions(1);

	const { createUpdate } = combineReducers({
		key: combineReducers({
			deep: null,
		}),
	});

	const state = {};
	const getState = () => state;
	const subscribe = actual => expect(actual).not.toBe(state);
	const update = createUpdate({getState, subscribe});
	update('key')('deep').set('hello');
});

it('Deep changes can be performed on missing object fragments', () => {
	expect.assertions(1);

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
		expect(actual).toEqual(expected);
	};
	const update = createUpdate({getState, subscribe});
	update('key')('deep').set('hello');
});

it('Throws when unused key is accessed', () => {
	const { createUpdate } = combineReducers({});

	const getState = () => ({});
	const subscribe = () => null;
	const update = createUpdate({getState, subscribe});
	expect(() => update('key')).toThrow();
});
