// @flow

import test from 'ava';

import { createMap } from '../../operators';
import Coercer from './';

const map = createMap({
	coerce: Coercer(),
});

const string = {
	coerce: value => String(value),
};

const { coerce } = map(string);

test('Coerce existing array', t => {
	const actual = coerce({
		key: 123,
	});
	const expected = {
		key: '123',
	};
	t.deepEqual(actual, expected);
});

test('Coerce non-array', t => {
	const actual = coerce(undefined);
	const expected = {};
	t.deepEqual(actual, expected);
});

test('Coerce object-ish object', t => {
	const expected = {
		key: 'hello',
		anotherKey: 'hi',
	};

	// $FlowFixMe
	const toCoerce = Object.assign(123, expected);

	const actual = coerce(toCoerce);
	t.deepEqual(actual, expected);
});

test('Object of reducers with no coercion', t => {
	const { coerce: emptyCoerce } = map({});
	const actual = emptyCoerce({key: 'value'});
	const expected = {key: 'value'};
	t.deepEqual(actual, expected);
});
