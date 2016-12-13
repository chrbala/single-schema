// @flow

import test from 'ava';

import { createArray } from '../../operators';
import { EXPECTED_ARRAY } from './strings';
import Validator from './';

const array = createArray({
	validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
		? null
		: IS_STRING_ERROR,
};

const { validate } = array(isString);

test('Array pass', t => {
	const actual = validate(['hello', 'whatever']);
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Array type fail', t => {
	const actual = validate('something');
	const expected = EXPECTED_ARRAY;
	t.deepEqual(actual, expected);
});

test('Array datum fail', t => {
	const actual = validate(['hello', 123]);
	const expected = [null, IS_STRING_ERROR];
	t.deepEqual(actual, expected);
});
