// @flow

import { createMap } from '../../operators';
import Async from './';
import Validator from '../../flatteners/validator';

const map = createMap({
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

const { validate } = map(isStringAsync);

it('Map pass', async () => {
	const actual = await validate({
		key1: 'hello', 
		key2: 'whatever',
	});
	const expected = null;
	expect(actual).toEqual(expected);
});

it('Map fail', async () => {
	const actual = await validate({
		key1: 123, 
		key2: 'hello',
	});
	const expected = {
		key1: IS_STRING_ERROR,
	};
	expect(actual).toEqual(expected);
});
