// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import { createArray } from '../../operators';
import Updater from './';
import Shape from '../shaper';

const flatteners = {
	createUpdate: Updater(),
	shape: Shape(),
};

const combineReducers = createCombineReducers(flatteners);
const array = createArray(flatteners);

(() => {
	const { createUpdate } = array({});

	test('Can set the current value of the array', t => {
		t.plan(1);

		const VALUE = ['VALUE'];

		const state = [];
		const getState = () => state;
		const subscribe = actual => t.is(actual, VALUE);
		const update = createUpdate({getState, subscribe});
		update.set(VALUE);
	});

	test('Can run an arrayOp', t => {
		t.plan(1);

		const getState = () => [];
		const subscribe = actual => t.deepEqual(actual, ['hello']);
		const update = createUpdate({getState, subscribe});
		update.push('hello');
	});

	test('arrayOp returns correct value', t => {
		const getState = () => ['hello'];
		const subscribe = () => null;
		const update = createUpdate({getState, subscribe});
		const actual = update.pop();
		const expected = 'hello';
		t.is(actual, expected);
	});

	/* eslint-disable quote-props */
	test('arrayOp coerces non-array values to empty array', t => {
		t.plan(1);

		const getState = () => ({'0': 'hello', length: 5});
		const subscribe = actual => t.deepEqual(actual, ['onlyValue']);
		const update = createUpdate({getState, subscribe});
		update.push('onlyValue');
	});
	/* eslint-enable quote-props */

	test('arrayOp does not mutate', t => {
		t.plan(2);

		const state = [];
		const getState = () => state;
		const subscribe = data => t.not(state, data);
		const update = createUpdate({getState, subscribe});
		update.push('hello');
		const expected = [];
		t.deepEqual(state, expected);
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

	test('Can use get to set values in an array', t => {
		t.plan(1);

		const getState = () => ['value1', 'value2'];
		const subscribe = actual => t.deepEqual(actual, ['value1', 'newValue']);
		const update = createUpdate({getState, subscribe});
		update.get(1).set('newValue');
	});
})();

test('Can use get to set deep keys in an array', t => {
	t.plan(1);

	const { createUpdate } = array(
		combineReducers({
			key: null,
		})
	);
	
	const getState = () => [{key: 'value1'}, {key: 'value2'}];
	const expected = [
		{key: 'value1'},
		{key: 'newValue'},
	];
	const subscribe = actual => t.deepEqual(actual, expected);
	const update = createUpdate({getState, subscribe});
	update.get(1)('key').set('newValue');
});

test('Push the default shape with no args', t => {
	const VALUE = 'VALUE';
	const { createUpdate } = array({
		shape: () => VALUE,
	});

	const getState = () => [];
	const subscribe = actual => t.deepEqual(actual, [VALUE]);
	const update = createUpdate({getState, subscribe});
	update.push();
});

test('Can push an explicit undefined', t => {
	const VALUE = 'VALUE';
	const { createUpdate } = array({
		shape: () => VALUE,
	});

	const getState = () => [];
	const subscribe = actual => t.deepEqual(actual, [undefined]);
	const update = createUpdate({getState, subscribe});
	update.push(undefined);
});
