// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import Validator from './';
import { 
	EXTRA_KEY_TEXT, 
	EXPECTED_OBJECT, 
} from './strings';

const combineReducers = createCombineReducers({
	validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
	? null
	: IS_STRING_ERROR,
};

const { validate } = combineReducers({
	key: isString,
});

test('Basic passing validation', t => {
	const actual = validate({
		key: 'value',
	});
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Basic failing validation', t => {
	const actual = validate({
		key: 123,
	});
	const expected = {
		key: IS_STRING_ERROR,
	};
	t.deepEqual(actual, expected);
});

test('Unexpected property', t => {
	const actual = validate({
		key: 'value',
		key2: 'value',
	});
	const expected = {
		key2: EXTRA_KEY_TEXT,
	};
	t.deepEqual(actual, expected);
});

test('Missing property fails', t => {
	const actual = validate({

	});
	const expected = {
		key: IS_STRING_ERROR,
	};
	t.deepEqual(actual, expected);
});

test('Top level undefined does not pass', t => {
	const actual = validate(undefined);
	const expected = EXPECTED_OBJECT;
	t.deepEqual(actual, expected);
});

test('Top level null does not pass', t => {
	const actual = validate(null);
	const expected = EXPECTED_OBJECT;
	t.deepEqual(actual, expected);
});
