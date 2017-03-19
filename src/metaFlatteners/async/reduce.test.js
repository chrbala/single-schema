// @flow

import createCombineReducers from '../../createCombineReducers';
import Async from './';
import Validator from '../../flatteners/validator';
import { EXTRA_KEY_TEXT } from '../../flatteners/validator/strings';

const combineReducers = createCombineReducers({
  validate: Async(Validator()),
});

const IS_STRING_ERROR = 'Must be string';
const isStringAsync = {
  validate: value =>
    new Promise(resolve =>
      setTimeout(
        () => resolve(typeof value == 'string' ? null : IS_STRING_ERROR),
        10,
      )),
};

describe('Single level of depth', () => {
  const { validate } = combineReducers({
    key1: isStringAsync,
    key2: isStringAsync,
  });

  it('async positive test', async () => {
    const actual = await validate({
      key1: 'hello',
      key2: 'hi',
    });
    const expected = null;
    expect(actual).toBe(expected);
  });

  it('async positive test', async () => {
    const actual = await validate({
      key1: 'hello',
      key2: 123,
    });
    const expected = {
      key2: IS_STRING_ERROR,
    };
    expect(actual).toEqual(expected);
  });

  it('async unexpected key', async () => {
    const actual = await validate({
      key1: 'hello',
      key2: 'hi',
      extra: 'something',
    });
    const expected = {
      extra: EXTRA_KEY_TEXT,
    };
    expect(actual).toEqual(expected);
  });
});

it('async deep keys', async () => {
  const { validate } = combineReducers({
    key: combineReducers({
      deep: isStringAsync,
    }),
  });

  const actual = await validate({
    key: {
      deep: 123,
    },
  });
  const expected = {
    key: {
      deep: IS_STRING_ERROR,
    },
  };
  expect(actual).toEqual(expected);
});

it('async no validator', async () => {
  const { validate } = combineReducers({
    key: {},
  });

  const actual = await validate({
    key: 'hello',
  });
  const expected = null;
  expect(actual).toEqual(expected);
});
