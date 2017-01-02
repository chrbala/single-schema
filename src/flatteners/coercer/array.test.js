// @flow

import { createArray } from '../../operators';
import Coercer from './';

const array = createArray({
	coerce: Coercer(),
});

const isString = {
	coerce: value => String(value),
};

const { coerce } = array(isString);

it('Coerce existing array', () => {
	const actual = coerce([123, 'whatever', null, undefined]);
	const expected = ['123', 'whatever', 'null', 'undefined'];
	expect(actual).toEqual(expected);
});

it('Coerce non-array', () => {
	const actual = coerce(undefined);
	const expected = [];
	expect(actual).toEqual(expected);
});

/* eslint-disable quote-props, no-sparse-arrays */
it('Coerce array-ish object', () => {
	const actual = coerce({
		'1': 'hello',
		length: 2,
	});
	const expected = [, 'hello'];
	expect(actual).toEqual(expected);
});
/* eslint-enable quote-props, no-sparse-arrays */

it('Array of reducers with no coercion', () => {
	const { coerce: emptyCoerce } = array({});
	const actual = emptyCoerce(['hi']);
	const expected = ['hi'];
	expect(actual).toEqual(expected);
});
