// @flow

import createCombineReducers from '../../createCombineReducers';
import Async from './';
import Validator from '../../flatteners/validator';

const combineReducers = createCombineReducers({
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

const { validate } = combineReducers({
	key1: isStringAsync,
	key2: isStringAsync,
});

it('async positive test', async () => {
	const actual = await validate({
		key1: 'hello',
		key2: 'hi',
	});
	const expected = null;
	expect(actual).toBe(expected);
});

it('async positive test', async () => {
	const actual = await validate({
		key1: 'hello',
		key2: 123,
	});
	const expected = {
		key2: IS_STRING_ERROR,
	};
	expect(actual).toEqual(expected);
});
