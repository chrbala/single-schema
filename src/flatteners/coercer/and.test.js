// @flow

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

it('Can coerce with multiple reducers', () => {
	const { coerce } = and(isString, maxLength(3));
	const actual = coerce(12345);
	const expected = '123';
	expect(actual).toBe(expected);
});

it('Skips missing children', () => {
	const { coerce } = and(isString, {}, maxLength(3));
	const actual = coerce(12345);
	const expected = '123';
	expect(actual).toBe(expected);
});

it('Works if no children have a coerce', () => {
	const { coerce } = and({}, {});
	const actual = coerce(12345);
	const expected = 12345;
	expect(actual).toBe(expected);
});
