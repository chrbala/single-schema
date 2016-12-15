// @flow

import test from 'ava';

import { createAnd } from '../../operators';
import Shaper from './';

const LEAF_NODE = 'leafNode';
const USED = 'used';
const NOT_USED = 'notUsed';

const flatteners = {
	shape: Shaper({leafNode: LEAF_NODE}),
};

const and = createAnd(flatteners);

const reducer1 = {
	shape: () => USED,
};
const reducer2 = {
	shape: () => NOT_USED,
};
const missingReducer = {};

test('Takes only the first valid reducer', t => {
	const { shape } = and(reducer1, reducer2);
	const actual = shape();
	const expected = USED;
	t.is(actual, expected);
});

test('Skipes invalid reducers', t => {
	const { shape } = and(missingReducer, reducer1, reducer2);
	const actual = shape();
	const expected = USED;
	t.is(actual, expected);
});

test('Uses leaf node for missing children', t => {
	const { shape } = and(missingReducer);
	const actual = shape();
	const expected = LEAF_NODE;
	t.is(actual, expected);
});
