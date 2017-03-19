// @flow

import { createMap } from '../../operators';
import Coercer from './';

const map = createMap({
  coerce: Coercer(),
});

const string = {
  coerce: value => String(value),
};

const { coerce } = map(string);

it('Coerce existing map', () => {
  const actual = coerce({
    key: 123,
  });
  const expected = {
    key: '123',
  };
  expect(actual).toEqual(expected);
});

it('Coerce non-map', () => {
  const actual = coerce(undefined);
  const expected = {};
  expect(actual).toEqual(expected);
});

it('Coerce object-ish object', () => {
  const expected = {
    key: 'hello',
    anotherKey: 'hi',
  };

  // $FlowFixMe
  const toCoerce = Object.assign(123, expected);

  const actual = coerce(toCoerce);
  expect(actual).toEqual(expected);
});

it('Object of reducers with no coercion', () => {
  const { coerce: emptyCoerce } = map({});
  const actual = emptyCoerce({ key: 'value' });
  const expected = { key: 'value' };
  expect(actual).toEqual(expected);
});
