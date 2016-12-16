// @flow

import test from 'ava';

import { createAnd } from '../../operators';
import Validator from './';

const and = createAnd({
	validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
	? null
	: IS_STRING_ERROR,
};

const TOO_LONG_ERROR = 'Too long!';
const maxLength = length => ({
	validate: data => data.length <= length
		? null
		: TOO_LONG_ERROR,
});

test('Can validate with multiple reducers', t => {
	const { validate } = and(isString, maxLength(3));
	t.is(validate(12345), IS_STRING_ERROR);
	t.is(validate('12345'), TOO_LONG_ERROR);
	t.is(validate('123'), null);
});
