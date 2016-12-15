// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import { createArray } from '../../operators';
import Updater from './';
import { push, pop, length, get } from './array';

const flatteners = {
	createUpdate: Updater(),
};

const combineReducers = createCombineReducers(flatteners);
const array = createArray(flatteners);

const whatever = () => () => 'whatever';
const { createUpdate } = array(whatever);

test('Can run an arrayOp', t => {
	t.plan(1);

	const getState = () => [];
	const subscribe = actual => t.deepEqual(actual, ['hello']);
	const update = createUpdate({getState, subscribe});
	push(update)('hello');
});

test('arrayOp returns correct value', t => {
	const getState = () => ['hello'];
	const subscribe = () => null;
	const update = createUpdate({getState, subscribe});
	const actual = pop(update)();
	const expected = 'hello';
	t.is(actual, expected);
});

/* eslint-disable quote-props */
test('arrayOp coerces non-array values to empty array', t => {
	t.plan(1);

	const getState = () => ({'0': 'hello', length: 5});
	const subscribe = actual => t.deepEqual(actual, ['onlyValue']);
	const update = createUpdate({getState, subscribe});
	push(update)('onlyValue');
});
/* eslint-enable quote-props */

test('arrayOp does not mutate', t => {
	t.plan(2);

	const state = [];
	const getState = () => state;
	const subscribe = data => t.not(state, data);
	const update = createUpdate({getState, subscribe});
	push(update)('hello');
	const expected = [];
	t.deepEqual(state, expected);
});

test('Can replace state', t => {
	t.plan(1);

	const getState = () => [];
	const subscribe = data => t.deepEqual(data, [1, 2, 3]);
	const update = createUpdate({getState, subscribe});
	update([1, 2, 3]);
});

test('Can replace state with undefined', t => {
	t.plan(1);

	const getState = () => [];
	const subscribe = data => t.is(data, undefined);
	const update = createUpdate({getState, subscribe});
	update(undefined);
});

test('Can get length', t => {
	const getState = () => [1, 2, 3];
	const subscribe = () => null;
	const update = createUpdate({getState, subscribe});
	const actual = length(update)();
	const expected = 3;
	t.is(actual, expected);
});

test('Can use get to set values in an array', t => {
	t.plan(1);

	const getState = () => ['value1', 'value2'];
	const subscribe = actual => t.deepEqual(actual, ['value1', 'newValue']);
	const update = createUpdate({getState, subscribe});
	get(update)(1)('newValue');
});

test('Can use get to set deep keys in an array', t => {
	t.plan(1);

	const { createUpdate: createDeepUpdate } = array(
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
	const update = createDeepUpdate({getState, subscribe});
	get(update)(1).key('newValue');
});
