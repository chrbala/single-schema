// @flow

import test from 'ava';

import { combineReducers, combineReducersAsync } from './validate';
import { NonNull, Permissive, And, PermissiveAsync } from './wrappers';
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

(() => {
	const isStringComplex = {
		validate: isString,
		coerce: value => String(value),
	};

	const minLength = length => ({
		validate: value => value.length >= length
			? null
			: `Must be greater than or equal to length: ${length}`,
	});

	const maxLength = length => ({
		validate: value => value.length <= length
			? null
			: `Must be less than or equal to length: ${length}`,
		coerce: value => value.slice(0, length),
	});

	test('And simple pass', t => {
		const { validate } = And(isString);
		const actual = validate('hi');
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('And simple fail', t => {
		const { validate } = And(isString);
		const actual = validate(123);
		const expected = IS_STRING_ERROR;
		t.deepEqual(actual, expected);
	});

	test('And pass all', t => {
		const { validate } = And(isString, minLength(2), maxLength(5));
		const actual = validate('hi');
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('And single failure first', t => {
		const { validate } = And(isString, minLength(2), maxLength(5));
		const actual = validate(123);
		const expected = IS_STRING_ERROR;
		t.deepEqual(actual, expected);
	});

	test('And single failure last', t => {
		const { validate } = And(isString, minLength(2), maxLength(5));
		const actual = validate('123456');
		const expected = 'Must be less than or equal to length: 5';
		t.deepEqual(actual, expected);
	});

	test('And exits early on failure', t => {
		let count = 0;
		const spy = () => count++;

		const { validate } = And(isString, minLength(2), maxLength(5), spy);
		t.is(count, 1); // initialization executes all once

		validate(123);
		t.is(count, 1);

		validate('hi');
		t.is(count, 2);
	});

	test('And edge case with no validators', t => {
		const { validate } = And();
		const actual = validate('hi');
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('And arbitrary key', t => {
		const { coerce } = And(isStringComplex, minLength(2), maxLength(5));
		const actual = coerce(123456); 
		const expected = '12345';
		t.deepEqual(actual, expected);
	});
	
})();
