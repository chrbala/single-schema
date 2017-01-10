// @flow

import { createMaybe } from '../../operators';
import Async from './';
import Validator from '../../flatteners/validator';

const maybe = createMaybe({
	validate: Async(Validator()),
});

const IS_STRING_ERROR = 'Must be string';
const isStringAsync = {
	validate: value => new Promise(resolve => 
		setTimeout(() => resolve(typeof value == 'string'
			? null
			: IS_STRING_ERROR
		), 10)
	),
};

const { validate } = maybe(isStringAsync);

it('Maybe pass', async () => {
	const actual = await validate('hello');
	const expected = null;
	expect(actual).toEqual(expected);
});

it('Maybe fail', async () => {
	const actual = await validate(123);
	const expected = IS_STRING_ERROR;
	expect(actual).toEqual(expected);
});

it('Maybe null param', async () => {
	const actual = await validate(null);
	const expected = null;
	expect(actual).toEqual(expected);
});
