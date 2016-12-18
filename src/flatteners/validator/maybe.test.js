// @flow

import test from 'ava';

import { createMaybe } from '../../operators';
import Validator from './';

const maybe = createMaybe({
	validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
	? null
	: IS_STRING_ERROR,
};

test('Can use maybe with existing data', t => {
	const { validate } = maybe(isString);
	const actual = validate(12345);
	const expected = IS_STRING_ERROR;
	t.is(actual, expected);
});

test('Can use maybe with missing data', t => {
	const { validate } = maybe(isString);
	t.is(validate(null), null);
	t.is(validate(undefined), null);
	t.is(validate(), null);
});
