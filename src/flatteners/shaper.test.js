// @flow

import test from 'ava';

import createCombineReducers from '../createCombineReducers';
import Shaper from './shaper';

const combineReducers = createCombineReducers({
	shape: Shaper({leafNode: true}),
}, {
	defaultFlattener: 'shape',
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
