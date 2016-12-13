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

test('Top level undefined passes', t => {
	const actual = validate(undefined);
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Top level null passes', t => {
	const actual = validate(null);
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Top level 0 does not pass', t => {
	const actual = validate(0);
	const expected = EXPECTED_OBJECT;
	t.deepEqual(actual, expected);
});

test('Top level empty string does not pass', t => {
	const actual = validate('');
	const expected = EXPECTED_OBJECT;
	t.deepEqual(actual, expected);
});
