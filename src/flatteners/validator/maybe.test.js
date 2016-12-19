// @flow

import test from 'ava';

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import Validator from './';

const flatteners = {
	validate: Validator(),
};

const combineReducers = createCombineReducers(flatteners);
const maybe = createMaybe(flatteners);

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
	? null
	: IS_STRING_ERROR,
};

test('Can use maybe with existing data', t => {
	const { validate } = maybe(isString);
	const actual = validate(12345);
	const expected = IS_STRING_ERROR;
	t.is(actual, expected);
});

test('Can use maybe with missing data', t => {
	const { validate } = maybe(isString);
	t.is(validate(null), null);
	t.is(validate(undefined), null);
	t.is(validate(), null);
});

test('Recursive data structure positive test', t => {
	const node = combineReducers(() => ({
		value: isString,
		next: maybe(node),
	}));
	const { validate } = node;
	const actual = validate({
		value: 'one',
		next: {
			value: 'two',
			next: {
				value: 'three',
				next: null,
			},
		},
	});
	const expected = null;
	t.is(actual, expected);
});

test('Recursive data structure negative test', t => {
	const node = combineReducers(() => ({
		value: isString,
		next: maybe(node),
	}));
	const { validate } = node;
	const actual = validate({
		value: 'one',
		next: {
			value: 'two',
			next: {
				value: 123,
				next: null,
			},
		},
	});
	const expected = {
		next: {
			next: {
				value: IS_STRING_ERROR,
			},
		},
	};
	t.deepEqual(actual, expected);
});
