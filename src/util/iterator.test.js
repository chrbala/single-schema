// @flow

import Spy from '../helpers/spy';

import Iterator from './iterator';

it('Caches simple results when called with identical data', () => {
  const spy = Spy();
  const iterate = Iterator({ cache: true });
  const data = {
    key: 'value',
  };
  const callbacks = {
    key: spy,
  };

  expect(spy.timesRun()).toBe(0);

  iterate(callbacks, data, child => child());
  expect(spy.timesRun()).toBe(1);

  iterate(callbacks, data, child => child());
  expect(spy.timesRun()).toBe(1);
});

it('Invalidate cache when data changes', () => {
  const spy = Spy();
  const iterate = Iterator({ cache: true });
  let data = {
    key: 'value',
  };
  const callbacks = {
    key: spy,
  };

  expect(spy.timesRun()).toBe(0);

  iterate(callbacks, data, child => child());
  expect(spy.timesRun()).toBe(1);

  data = { ...data, key: 'newValue' };

  iterate(callbacks, data, child => child());
  expect(spy.timesRun()).toBe(2);
});

it('Reruns fragments of data types when data changes', () => {
  const spy1 = Spy();
  const spy2 = Spy();
  const iterate = Iterator({ cache: true });
  let data = {
    key1: 'value1',
    key2: 'value2',
  };
  const callbacks = {
    key1: spy1,
    key2: spy2,
  };

  expect(spy1.timesRun()).toBe(0);
  expect(spy2.timesRun()).toBe(0);

  iterate(callbacks, data, child => child());
  expect(spy1.timesRun()).toBe(1);
  expect(spy2.timesRun()).toBe(1);

  data = { ...data, key1: 'newValue' };

  iterate(callbacks, data, child => child());
  expect(spy1.timesRun()).toBe(2);
  expect(spy2.timesRun()).toBe(1);
});
