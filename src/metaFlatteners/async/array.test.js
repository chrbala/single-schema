// @flow

import { createArray } from '../../operators';
import Async from './';
import Validator from '../../flatteners/validator';

const array = createArray({
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

describe('one level of depth', () => {
  const { validate } = array(isStringAsync);

  it('Array pass', async () => {
    const actual = await validate(['hello', 'whatever']);
    const expected = null;
    expect(actual).toEqual(expected);
  });

  it('Array fail', async () => {
    const actual = await validate([123, 'hello']);
    const expected = [IS_STRING_ERROR, null];
    expect(actual).toEqual(expected);
  });
});

describe('depth test', async () => {
  const { validate } = array(array(isStringAsync));
  const actual = await validate([[123]]);
  const expected = [[IS_STRING_ERROR]];
  expect(actual).toEqual(expected);
});
