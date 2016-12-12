// @flow

import test from 'ava';
import Spy from '../helpers/spy';

import Iterator from './iterator';

test('Caches simple results when called with identical data', t => {
	const spy = Spy();
	const iterate = Iterator({cache: true});
	const data = {
		key: 'value',
	};
	const callbacks = {
		key: spy,
	};
	
	t.is(spy.timesRun(), 0);

	iterate(callbacks, data, child => child());
	t.is(spy.timesRun(), 1);

	iterate(callbacks, data, child => child());
	t.is(spy.timesRun(), 1);
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
	
	t.is(spy.timesRun(), 0);

	iterate(callbacks, data, child => child());
	t.is(spy.timesRun(), 1);

	data = { ...data, key: 'newValue' };

	iterate(callbacks, data, child => child());
	t.is(spy.timesRun(), 2);
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
	
	t.is(spy1.timesRun(), 0);
	t.is(spy2.timesRun(), 0);

	iterate(callbacks, data, child => child());
	t.is(spy1.timesRun(), 1);
	t.is(spy2.timesRun(), 1);

	data = { ...data, key1: 'newValue' };

	iterate(callbacks, data, child => child());
	t.is(spy1.timesRun(), 2);
	t.is(spy2.timesRun(), 1);
});
