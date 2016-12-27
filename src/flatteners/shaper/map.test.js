// @flow

import test from 'ava';

import { createMap } from '../../operators';
import Shaper from './';

const array = createMap({
	shape: Shaper(),
});

const { shape } = array({});

test('Coerce existing array', t => {
	const actual = shape();
	const expected = {};
	t.deepEqual(actual, expected);
});
