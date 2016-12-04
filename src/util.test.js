// @flow

import test from 'ava';

import { isPromise, checkIfResults } from './util';

test('isPromise positive', t => 
	t.true(isPromise(Promise.resolve()))
);

test('isPromise negative string', t => 
	t.false(isPromise('hello'))
);

test('isPromise negative function', t => 
	t.false(isPromise(() => null))
);

test('checkIfResults no errors', t => {
	const data = {};
	const actual = checkIfResults(data);
	const expected = null;
	t.deepEqual(actual, expected);
});

test('checkIfResults has errors', t => {
	const data = { someError: 'value' };
	const actual = checkIfResults(data);
	const expected = data;
	t.is(actual, expected);
});
