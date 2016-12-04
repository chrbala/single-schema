// @flow

import test from 'ava';

import { isPromise, checkIfErrors } from './util';

test('isPromise positive', t => 
	t.true(isPromise(Promise.resolve()))
);

test('isPromise negative string', t => 
	t.false(isPromise('hello'))
);

test('isPromise negative function', t => 
	t.false(isPromise(() => null))
);

test('checkIfErrors no errors', t => {
	const data = {};
	const actual = checkIfErrors(data);
	const expected = null;
	t.deepEqual(actual, expected);
});

test('checkIfErrors has errors', t => {
	const data = { someError: 'value' };
	const actual = checkIfErrors(data);
	const expected = data;
	t.is(actual, expected);
});
