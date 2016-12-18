// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import Shaper from './';

const combineReducers = createCombineReducers({
	shape: Shaper({leafNode: true}),
});

const empty = null;

test('Basic shape', t => {
	const { shape } = combineReducers({
		key: empty,
		key2: empty,
	});

	const actual = shape();
	const expected = {
		key: true,
		key2: true,
	};

	t.deepEqual(actual, expected);
});

test('Shape removes undefined keys', t => {
	const { shape } = combineReducers({
		key: {
			shape: () => undefined,
		},
		key2: empty,
	});

	const actual = shape();
	const expected = {
		key2: true,
	};

	t.deepEqual(actual, expected);
});

test('Deep shape', t => {
	const { shape } = combineReducers({
		key: empty,
		key2: combineReducers({
			deep: combineReducers({
				deeper: combineReducers({
					deepest: empty,
				}),
			}),
		}),
	});

	const actual = shape();
	const expected = {
		key: true,
		key2: {
			deep: {
				deeper: {
					deepest: true,
				},
			},
		},
	};

	t.deepEqual(actual, expected);
});
