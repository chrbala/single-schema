// @flow

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

	it('Can set the current value of the array', () => {
		expect.assertions(1);

		const VALUE = ['VALUE'];

		const state = [];
		const getState = () => state;
		const subscribe = actual => expect(actual).toBe(VALUE);
		const update = createUpdate({getState, subscribe});
		update.set(VALUE);
	});

	it('Can run an arrayOp', () => {
		expect.assertions(1);

		const getState = () => [];
		const subscribe = actual => expect(actual).toEqual(['hello']);
		const update = createUpdate({getState, subscribe});
		update.push('hello');
	});

	it('arrayOp returns correct value', () => {
		const getState = () => ['hello'];
		const subscribe = () => null;
		const update = createUpdate({getState, subscribe});
		const actual = update.pop();
		const expected = 'hello';
		expect(actual).toBe(expected);
	});

	/* eslint-disable quote-props */
	it('arrayOp coerces non-array values to empty array', () => {
		expect.assertions(1);

		const getState = () => ({'0': 'hello', length: 5});
		const subscribe = actual => expect(actual).toEqual(['onlyValue']);
		const update = createUpdate({getState, subscribe});
		update.push('onlyValue');
	});
	/* eslint-enable quote-props */

	it('arrayOp does not mutate', () => {
		expect.assertions(2);

		const state = [];
		const getState = () => state;
		const subscribe = data => expect(state).not.toBe(data);
		const update = createUpdate({getState, subscribe});
		update.push('hello');
		const expected = [];
		expect(state).toEqual(expected);
	});

	it('Can replace state', () => {
		expect.assertions(1);

		const getState = () => [];
		const subscribe = data => expect(data).toEqual([1, 2, 3]);
		const update = createUpdate({getState, subscribe});
		update.set([1, 2, 3]);
	});

	it('Can replace state with undefined', () => {
		expect.assertions(1);

		const getState = () => [];
		const subscribe = data => expect(data).toBe(undefined);
		const update = createUpdate({getState, subscribe});
		update.set(undefined);
	});

	it('Can use get to set values in an array', () => {
		expect.assertions(1);

		const getState = () => ['value1', 'value2'];
		const subscribe = actual => expect(actual).toEqual(['value1', 'newValue']);
		const update = createUpdate({getState, subscribe});
		update(1).set('newValue');
	});
})();

it('Can use get to set deep keys in an array', () => {
	expect.assertions(1);

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
	const subscribe = actual => expect(actual).toEqual(expected);
	const update = createUpdate({getState, subscribe});
	update(1)('key').set('newValue');
});

it('Push the default shape with no args', () => {
	const VALUE = 'VALUE';
	const { createUpdate } = array({
		shape: () => VALUE,
	});

	const getState = () => [];
	const subscribe = actual => expect(actual).toEqual([VALUE]);
	const update = createUpdate({getState, subscribe});
	update.push();
});

it('Can push an explicit undefined', () => {
	const VALUE = 'VALUE';
	const { createUpdate } = array({
		shape: () => VALUE,
	});

	const getState = () => [];
	const subscribe = actual => expect(actual).toEqual([undefined]);
	const update = createUpdate({getState, subscribe});
	update.push(undefined);
});
