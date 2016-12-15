// @flow

import test from 'ava';

import { createAnd } from '../../operators';
import Coercer from './';

const and = createAnd({
	coerce: Coercer(),
});

const isString = {
	coerce: data => String(data),
};
const maxLength = length => ({
	coerce: data => data.slice(0, length),
});

test('Can run an arrayOp', t => {
	const { coerce } = and(isString, maxLength(3));
	const actual = coerce(12345);
	const expected = '123';
	t.is(actual, expected);
});
