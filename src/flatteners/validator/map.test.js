// @flow

import { createMap } from '../../operators';
import { EXPECTED_OBJECT } from './strings';
import Validator from './';

const map = createMap({
  validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
  validate: value => typeof value == 'string' ? null : IS_STRING_ERROR,
};

const { validate } = map(isString);

it('Object pass', () => {
  const actual = validate({ key: '123' });
  const expected = null;
  expect(actual).toEqual(expected);
});

it('Object type fail', () => {
  const actual = validate('something');
  const expected = EXPECTED_OBJECT;
  expect(actual).toEqual(expected);
});

it('Object datum fail', () => {
  const actual = validate({ key: 123 });
  const expected = {
    key: IS_STRING_ERROR,
  };
  expect(actual).toEqual(expected);
});

it('Object mixed pass/fail', () => {
  const actual = validate({
    key1: '123',
    key2: 123,
  });
  const expected = {
    key2: IS_STRING_ERROR,
  };
  expect(actual).toEqual(expected);
});
