// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import Coercer from './';

const combineReducers = createCombineReducers({
	coerce: Coercer(),
});

const maybe = createMaybe({
	coerce: Coercer(),
});

const isString = {
	coerce: data => String(data),
};

test('Can use maybe with existing data', t => {
	const { coerce } = maybe(isString);
	t.is(coerce(123), '123');
});

test('Can use maybe with missing data', t => {
	const { coerce } = maybe(isString);
	t.is(coerce(null), null);
	t.is(coerce(undefined), undefined);
	t.is(coerce(), undefined);
});

test('Maybe leaves existing keys', t => {
	const { coerce } = combineReducers({
		key: maybe({}),
	});
	const actual = coerce({
		key: undefined,
	});
	const expected = {
		key: undefined,
	};
	t.deepEqual(actual, expected);
});

test('Maybe does not add new keys', t => {
	const { coerce } = combineReducers({
		key: maybe({}),
		somethingElse: {},
	});
	const actual = coerce({
		somethingElse: 'hi',
	});
	const expected = {
		somethingElse: 'hi',
	};
	t.deepEqual(actual, expected);
});
