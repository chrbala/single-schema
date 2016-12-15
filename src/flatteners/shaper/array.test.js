// @flow

import test from 'ava';

import { createArray } from '../../operators';
import Shaper from './';

const array = createArray({
	shape: Shaper(),
});

const whatever = () => () => 'whatever';

const { shape } = array(whatever);

test('Coerce existing array', t => {
	const actual = shape();
	const expected = [];
	t.deepEqual(actual, expected);
});
