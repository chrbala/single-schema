// @flow

import test from 'ava';

import Iterator from './iterator';

test.todo('Iterator base case without cache');

const Spy = () => {
	let count = 0;
	const execute = () => count++;
	execute.getValue = () => count;
	return execute;
};

test('Caches simple results when called with identical data', t => {
	const spy = Spy();
	const iterate = Iterator({cache: true});
	const data = {
		key: 'value',
	};
	const callbacks = {
		key: spy,
	};
	
	t.is(spy.getValue(), 0);

	iterate(callbacks, data, child => child());
	t.is(spy.getValue(), 1);

	iterate(callbacks, data, child => child());
	t.is(spy.getValue(), 1);
});

test('Invalidate cache when data changes', t => {
	const spy = Spy();
	const iterate = Iterator({cache: true});
	let data = {
		key: 'value',
	};
	const callbacks = {
		key: spy,
	};
	
	t.is(spy.getValue(), 0);

	iterate(callbacks, data, child => child());
	t.is(spy.getValue(), 1);

	data = { ...data, key: 'newValue' };

	iterate(callbacks, data, child => child());
	t.is(spy.getValue(), 2);
});

test('Reruns fragments of data types when data changes', t => {
	const spy1 = Spy();
	const spy2 = Spy();
	const iterate = Iterator({cache: true});
	let data = {
		key1: 'value1',
		key2: 'value2',
	};
	const callbacks = {
		key1: spy1,
		key2: spy2,
	};
	
	t.is(spy1.getValue(), 0);
	t.is(spy2.getValue(), 0);

	iterate(callbacks, data, child => child());
	t.is(spy1.getValue(), 1);
	t.is(spy2.getValue(), 1);

	data = { ...data, key1: 'newValue' };

	iterate(callbacks, data, child => child());
	t.is(spy1.getValue(), 2);
	t.is(spy2.getValue(), 1);
});
