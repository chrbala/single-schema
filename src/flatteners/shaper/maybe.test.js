// @flow

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import Shaper from './';

const combineReducers = createCombineReducers({
  shape: Shaper(),
});

const maybe = createMaybe({
  shape: Shaper(),
});

it('Maybe defaults to undefined', () => {
  const { shape } = maybe({});
  expect(shape()).toBe(undefined);
});

it('Maybe drops keys', () => {
  const { shape } = combineReducers({
    key: maybe({
      shape: () => true,
    }),
    somethingElse: {
      shape: () => true,
    },
  });
  const actual = shape();
  const expected = {
    somethingElse: true,
  };
  expect(actual).toEqual(expected);
});
