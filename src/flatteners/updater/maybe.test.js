// @flow

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import Updater from './';

const flatteners = {
	createUpdate: Updater(),
};

const combineReducers = createCombineReducers(flatteners);
const maybe = createMaybe(flatteners);

it('Recursive data structure shallow update', () => {
	expect.assertions(1);

	const node = combineReducers(() => ({
		value: null,
		next: maybe(node),
	}));
	const { createUpdate } = node;
	const getState = () => ({
		value: null,
		next: null,
	});
	const subscribe = actual => {
		const expected = {
			value: null,
			next: {
				value: null,
				next: null,
			},
		};

		expect(actual).toEqual(expected);
	};
	const update = createUpdate({getState, subscribe});
	update('next').set({
		value: null, 
		next: null,
	});
});

it('Recursive data structure deep update', () => {
	expect.assertions(1);

	const node = combineReducers(() => ({
		value: null,
		next: maybe(node),
	}));
	const { createUpdate } = node;
	const getState = () => ({
		value: null,
		next: {
			value: null,
			next: null,
		},
	});
	const subscribe = actual => {
		const expected = {
			value: null,
			next: {
				value: null,
				next: {
					value: null,
					next: null,
				},
			},
		};

		expect(actual).toEqual(expected);
	};
	const update = createUpdate({getState, subscribe});
	update('next')('next').set({
		value: null, 
		next: null,
	});
});

it('Can deep update on missing tree fragment', () => {
	expect.assertions(1);

	const node = combineReducers(() => ({
		value: null,
		next: maybe(node),
	}));
	const { createUpdate } = node;
	const getState = () => ({
		value: null,
		next: null,
	});
	const subscribe = actual => {
		const expected = {
			value: null,
			next: {
				// adds subtree as expected, but value is missing
				next: {
					value: null,
					next: null,
				},
			},
		};

		expect(actual).toEqual(expected);
	};
	const update = createUpdate({getState, subscribe});
	update('next')('next').set({
		value: null, 
		next: null,
	});
});
