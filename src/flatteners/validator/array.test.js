// @flow

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

it('Array pass', () => {
	const actual = validate(['hello', 'whatever']);
	const expected = null;
	expect(actual).toEqual(expected);
});

it('Array type fail', () => {
	const actual = validate('something');
	const expected = EXPECTED_ARRAY;
	expect(actual).toEqual(expected);
});

it('Array datum fail', () => {
	const actual = validate(['hello', 123]);
	const expected = [null, IS_STRING_ERROR];
	expect(actual).toEqual(expected);
});
