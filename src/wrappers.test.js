// @flow

import test from 'ava';

import { combineReducers, combineReducersAsync } from './validate';
import { NonNull, Permissive, PermissiveAsync } from './wrappers';
import { MISSING_KEY_TEXT } from './strings';

const IS_STRING_ERROR = 'Must be string';
const isString = value => typeof value == 'string'
	? null
	: IS_STRING_ERROR;

test('Top level undefined NonNull does not pass', t => {
	const { validate } = NonNull(combineReducers({
		key: isString,
	}));
	const actual = validate(undefined);
	const expected = MISSING_KEY_TEXT;
	t.deepEqual(actual, expected);
});

(() => {
	const { validate } = combineReducers({
		key: isString,
		key2: NonNull(isString),
	});

	test('Missing normal property', t => {
		const actual = validate({
			key2: 'value',
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('Missing NonNull property', t => {
		const actual = validate({
			key: 'value',
			key2: null,
		});
		const expected = {
			key2: MISSING_KEY_TEXT,
		};
		t.deepEqual(actual, expected);
	});
})();

test('Unexpected property on permissive type', t => {
	const { validate } = Permissive(combineReducers({
		key: isString,
		key2: isString,
	}));

	const actual = validate({
		key: 'value',
		key2: 'value',
		key3: 'value',
	});
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Unexpected property on async permissive type', async t => {
	const { validate } = PermissiveAsync(combineReducersAsync({
		key: isString,
		key2: isString,
	}));

	const actual = await validate({
		key: 'value',
		key2: 'value',
		key3: 'value',
	});
	const expected = null;
	t.deepEqual(actual, expected);
});

test('NonNull must be used on a sync reducer', t => {
	t.throws(() => {
		NonNull(async () => null);
	});
});

test('Permissive must be used on a sync reducer', t => {
	t.throws(() => {
		Permissive(async () => null);
	});
});
