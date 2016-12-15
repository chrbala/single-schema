// @flow

import test from 'ava';

import { createArray } from '../../operators';
import Coercer from './';

const array = createArray({
	coerce: Coercer(),
});

const isString = {
	coerce: value => String(value),
};

const { coerce } = array(isString);

test('Coerce existing array', t => {
	const actual = coerce([123, 'whatever', null, undefined]);
	const expected = ['123', 'whatever', 'null', 'undefined'];
	t.deepEqual(actual, expected);
});

test('Coerce non-array', t => {
	const actual = coerce(undefined);
	const expected = [];
	t.deepEqual(actual, expected);
});

/* eslint-disable quote-props, no-sparse-arrays */
test('Coerce array-ish object', t => {
	const actual = coerce({
		'1': 'hello',
		length: 2,
	});
	const expected = [, 'hello'];
	t.deepEqual(actual, expected);
});
/* eslint-enable quote-props, no-sparse-arrays */
