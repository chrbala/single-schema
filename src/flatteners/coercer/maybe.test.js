// @flow

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import Coercer from './';

const combineReducers = createCombineReducers({
  coerce: Coercer(),
});

const maybe = createMaybe({
  coerce: Coercer(),
});

const isString = {
  coerce: data => String(data),
};

it('Can use maybe with existing data', () => {
  const { coerce } = maybe(isString);
  expect(coerce(123)).toBe('123');
});

it('Can use maybe with missing data', () => {
  const { coerce } = maybe(isString);
  expect(coerce(null)).toBe(null);
  expect(coerce(undefined)).toBe(undefined);
  expect(coerce()).toBe(undefined);
});

it('Maybe leaves existing keys', () => {
  const { coerce } = combineReducers({
    key: maybe({}),
  });
  const actual = coerce({
    key: undefined,
  });
  const expected = {
    key: undefined,
  };
  expect(actual).toEqual(expected);
});

it('Maybe does not add new keys', () => {
  const { coerce } = combineReducers({
    key: maybe({}),
    somethingElse: {},
  });
  const actual = coerce({
    somethingElse: 'hi',
  });
  const expected = {
    somethingElse: 'hi',
  };
  expect(actual).toEqual(expected);
});

it('Recursive data structures', () => {
  const node = combineReducers(() => ({
    value: isString,
    next: maybe(node),
  }));
  const { coerce } = node;
  const actual = coerce({
    value: 'one',
    next: {
      value: 'two',
      next: {
        value: 123,
        next: null,
      },
    },
  });
  const expected = {
    value: 'one',
    next: {
      value: 'two',
      next: {
        value: '123',
        next: null,
      },
    },
  };
  expect(actual).toEqual(expected);
});
