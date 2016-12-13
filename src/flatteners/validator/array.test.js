// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import createOperator from '../../createOperator';
import { EXPECTED_ARRAY } from './strings';
import Validator from './';

const combineReducers = createCombineReducers({
	validate: Validator(),
}, {
	defaultFlattener: 'validate',
});

const array = createOperator('array')({
	validate: Validator(),
}, {
	defaultFlattener: 'validate',
});

const IS_STRING_ERROR = 'Must be string';
const isString = value => typeof value == 'string'
	? null
	: IS_STRING_ERROR;

const { validate } = combineReducers({
	key: array(isString),
});

test('Array pass', t => {
	const actual = validate({
		key: ['hello', 'whatever'],
	});
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Array type fail', t => {
	const actual = validate({
		key: 'something',
	});
	const expected = {
		key: EXPECTED_ARRAY,
	};
	t.deepEqual(actual, expected);
});

test('Array datum fail', t => {
	const actual = validate({
		key: ['hello', 123],
	});
	const expected = {
		key: [null, IS_STRING_ERROR],
	};
	t.deepEqual(actual, expected);
});
