// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import Shaper from './';

const combineReducers = createCombineReducers({
	shape: Shaper({leafNode: true}),
});

const maybe = createMaybe({
	shape: Shaper(),
});

test('Maybe defaults to undefined', t => {
	const { shape } = maybe({});
	t.is(shape(), undefined);
});

test('Maybe drops keys', t => {
	const { shape } = combineReducers({
		key: maybe({}),
		somethingElse: {},
	});
	const actual = shape();
	const expected = {
		somethingElse: true,
	};
	t.deepEqual(actual, expected);
});
