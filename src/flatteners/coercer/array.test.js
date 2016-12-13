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

test('Coerce array', t => {
	const actual = coerce([123, 'whatever', null, undefined]);
	const expected = ['123', 'whatever', 'null', 'undefined'];
	t.deepEqual(actual, expected);
});
