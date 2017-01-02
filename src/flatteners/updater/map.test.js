// @flow

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

	it('Can set the current value of the map', () => {
		expect.assertions(1);

		const VALUE = ['VALUE'];

		const state = [];
		const getState = () => state;
		const subscribe = actual => expect(actual).toBe(VALUE);
		const update = createUpdate({getState, subscribe});
		update.set(VALUE);
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

	it('Can use get to set values in a map', () => {
		expect.assertions(1);

		const getState = () => ({
			key: 'value',
		});
		const subscribe = actual => expect(actual).toEqual({
			key: 'newValue',
		});
		const update = createUpdate({getState, subscribe});
		update('key').set('newValue');
	});
})();

it('Can use get to set deep keys in a map', () => {
	expect.assertions(1);

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
	const subscribe = actual => expect(actual).toEqual(expected);
	const update = createUpdate({getState, subscribe});
	update('asdf')('key').set('newValue');
});

it('Push the default shape with no args', () => {
	expect.assertions(1);
	
	const VALUE = 'VALUE';
	const { createUpdate } = map({
		shape: () => VALUE,
	});

	const getState = () => ({});
	const subscribe = actual => expect(actual).toEqual({
		key: VALUE,
	});
	const update = createUpdate({getState, subscribe});
	update.insert('key');
});
