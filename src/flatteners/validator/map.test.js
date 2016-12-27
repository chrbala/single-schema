// @flow

import test from 'ava';

import { createMap } from '../../operators';
import { EXPECTED_OBJECT } from './strings';
import Validator from './';

const array = createMap({
	validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
		? null
		: IS_STRING_ERROR,
};

const { validate } = array(isString);

test('Object pass', t => {
	const actual = validate({key: '123'});
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Object type fail', t => {
	const actual = validate('something');
	const expected = EXPECTED_OBJECT;
	t.deepEqual(actual, expected);
});

test('Object datum fail', t => {
	const actual = validate({key: 123});
	const expected = {
		key: IS_STRING_ERROR,
	};
	t.deepEqual(actual, expected);
});
