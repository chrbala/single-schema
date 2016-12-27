// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import { createMap } from '../../operators';
import Updater from './';
import Shape from '../shaper';

const flatteners = {
	createUpdate: Updater(),
	shape: Shape(),
};

const combineReducers = createCombineReducers(flatteners);
const map = createMap(flatteners);

(() => {
	const { createUpdate } = map({});

	test('Can set the current value of the map', t => {
		t.plan(1);

		const VALUE = ['VALUE'];

		const state = [];
		const getState = () => state;
		const subscribe = actual => t.is(actual, VALUE);
		const update = createUpdate({getState, subscribe});
		update.set(VALUE);
	});

	test('Can replace state', t => {
		t.plan(1);

		const getState = () => [];
		const subscribe = data => t.deepEqual(data, [1, 2, 3]);
		const update = createUpdate({getState, subscribe});
		update.set([1, 2, 3]);
	});

	test('Can replace state with undefined', t => {
		t.plan(1);

		const getState = () => [];
		const subscribe = data => t.is(data, undefined);
		const update = createUpdate({getState, subscribe});
		update.set(undefined);
	});

	test('Can use get to set values in a map', t => {
		t.plan(1);

		const getState = () => ({
			key: 'value',
		});
		const subscribe = actual => t.deepEqual(actual, {
			key: 'newValue',
		});
		const update = createUpdate({getState, subscribe});
		update('key').set('newValue');
	});
})();

test('Can use get to set deep keys in a map', t => {
	t.plan(1);

	const { createUpdate } = map(
		combineReducers({
			key: null,
		})
	);
	
	const getState = () => ({
		asdf: {},
	});
	const expected = {
		asdf: {
			key: 'newValue',
		},
	};
	const subscribe = actual => t.deepEqual(actual, expected);
	const update = createUpdate({getState, subscribe});
	update('asdf')('key').set('newValue');
});

test('Push the default shape with no args', t => {
	t.plan(1);
	
	const VALUE = 'VALUE';
	const { createUpdate } = map({
		shape: () => VALUE,
	});

	const getState = () => ({});
	const subscribe = actual => t.deepEqual(actual, {
		key: VALUE,
	});
	const update = createUpdate({getState, subscribe});
	update.insert('key');
});
