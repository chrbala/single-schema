// @flow

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

it('Object pass', () => {
	const actual = validate({key: '123'});
	const expected = null;
	expect(actual).toEqual(expected);
});

it('Object type fail', () => {
	const actual = validate('something');
	const expected = EXPECTED_OBJECT;
	expect(actual).toEqual(expected);
});

it('Object datum fail', () => {
	const actual = validate({key: 123});
	const expected = {
		key: IS_STRING_ERROR,
	};
	expect(actual).toEqual(expected);
});
