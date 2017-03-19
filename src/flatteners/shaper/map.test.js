// @flow

import { createMap } from '../../operators';
import Shaper from './';

const map = createMap({
  shape: Shaper(),
});

const { shape } = map({});

it('Coerce existing map', () => {
  const actual = shape();
  const expected = {};
  expect(actual).toEqual(expected);
});
