// @flow

import test from 'ava';

import createCombineReducers from '../createCombineReducers';
import Coercer from './coercer';

const combineReducers = createCombineReducers({
	coerce: Coercer(),
}, {
	defaultFlattener: 'coerce',
});

const coerceString = data => String(data);

test('Basic coercion', t => {
	const { coerce } = combineReducers({
		key: coerceString,
	});

	const actual = coerce({
		key: 123,
	});
	const expected = {
		key: '123',
	};

	t.deepEqual(actual, expected);
});
