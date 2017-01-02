// @flow

import { createMap } from '../../operators';
import Shaper from './';

const array = createMap({
	shape: Shaper(),
});

const { shape } = array({});

it('Coerce existing array', () => {
	const actual = shape();
	const expected = {};
	expect(actual).toEqual(expected);
});
