// @flow

import createCombineReducers from '../../createCombineReducers';
import { createMaybe } from '../../operators';
import Validator from './';

const flatteners = {
  validate: Validator(),
};

const combineReducers = createCombineReducers(flatteners);
const maybe = createMaybe(flatteners);

const IS_STRING_ERROR = 'Must be string';
const isString = {
  validate: value => typeof value == 'string' ? null : IS_STRING_ERROR,
};

it('Can use maybe with existing data', () => {
  const { validate } = maybe(isString);
  const actual = validate(12345);
  const expected = IS_STRING_ERROR;
  expect(actual).toBe(expected);
});

it('Can use maybe with missing data', () => {
  const { validate } = maybe(isString);
  expect(validate(null)).toBe(null);
  expect(validate(undefined)).toBe(null);
  expect(validate()).toBe(null);
});

it('Recursive data structure positive test', () => {
  const node = combineReducers(() => ({
    value: isString,
    next: maybe(node),
  }));
  const { validate } = node;
  const actual = validate({
    value: 'one',
    next: {
      value: 'two',
      next: {
        value: 'three',
        next: null,
      },
    },
  });
  const expected = null;
  expect(actual).toBe(expected);
});

it('Recursive data structure negative test', () => {
  const node = combineReducers(() => ({
    value: isString,
    next: maybe(node),
  }));
  const { validate } = node;
  const actual = validate({
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
    next: {
      next: {
        value: IS_STRING_ERROR,
      },
    },
  };
  expect(actual).toEqual(expected);
});
