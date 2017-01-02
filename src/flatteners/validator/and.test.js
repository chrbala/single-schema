// @flow

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

it('Can validate with multiple reducers', () => {
	const { validate } = and(isString, maxLength(3));
	expect(validate(12345)).toBe(IS_STRING_ERROR);
	expect(validate('12345')).toBe(TOO_LONG_ERROR);
	expect(validate('123')).toBe(null);
});
