// @flow

import test from 'ava';

import { combineReducers, combineReducersAsync } from './validate';
import { isAsync } from './util';

const IS_STRING_ERROR = 'Must be string';
const isString = value => typeof value == 'string'
	? null
	: IS_STRING_ERROR;
const coerceString = value => String(value);

const stringReducer = {
	validate: isString,
	coerce: coerceString,
};

test('Complex reducer provides exactly the validate key', t => {
	const reducer = combineReducers({});
	const actual = Object.keys(reducer);
	const expected = [ 'validate' ];
	t.deepEqual(actual, expected);
});

test('Complex sync reducers base case', t => {
	const { validate } = combineReducers({
		key: { validate: isString },
	});

	const actual = validate({
		key: 'hello',
	});
	const expected = null;
	t.deepEqual(actual, expected);
});

test('Complex sync reducers simple coercion', t => {
	const { validate, coerce } = combineReducers({
		key: stringReducer,
	});

	const data = {
		key: 1234,
	};
	let actual = validate(data);
	let expected = {
		key: IS_STRING_ERROR,
	};
	t.deepEqual(actual, expected);

	const coercedData = coerce(data);
	actual = validate(coercedData);
	expected = null;
	t.deepEqual(actual, expected); 
});

test('Complex sync reducers propogate upwards', t => {
	const reducer = combineReducers({
		key: combineReducers({
			deep: stringReducer,
		}),
	});

	let actual = Object.keys(reducer);
	let expected = [ 'validate', 'coerce' ];
	t.deepEqual(actual, expected);

	const { validate, coerce } = reducer;

	const data = {
		key: {
			deep: 1234,
		},
	};
	actual = validate(data);
	expected = {
		key: {
			deep: IS_STRING_ERROR,
		},
	};
	t.deepEqual(actual, expected);

	const coercedData = coerce(data);
	actual = validate(coercedData);
	expected = null;
	t.deepEqual(actual, expected);
});

test('Complex async reducers create async validator', t => {
	const reducer = combineReducersAsync({
		key: combineReducers({
			deep: stringReducer,
		}),
	});

	t.true(isAsync(reducer.validate));
});

test('Complex async reducers create async arbitrary functions', t => {
	const reducer = combineReducersAsync({
		key: combineReducers({
			deep: stringReducer,
		}),
	});

	t.true(isAsync(reducer.coerce));
});
