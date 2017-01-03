// @flow

import createCombineReducers from '../../createCombineReducers';
import Shaper from './';

const combineReducers = createCombineReducers({
	shape: Shaper(),
});

const empty = {
	shape: () => true,
};

it('Basic shape', () => {
	const { shape } = combineReducers({
		key: empty,
		key2: empty,
	});

	const actual = shape();
	const expected = {
		key: true,
		key2: true,
	};

	expect(actual).toEqual(expected);
});

it('Shape removes undefined keys', () => {
	const { shape } = combineReducers({
		key: {
			shape: () => undefined,
		},
		key2: empty,
	});

	const actual = shape();
	const expected = {
		key2: true,
	};

	expect(actual).toEqual(expected);
});

it('Deep shape', () => {
	const { shape } = combineReducers({
		key: empty,
		key2: combineReducers({
			deep: combineReducers({
				deeper: combineReducers({
					deepest: empty,
				}),
			}),
		}),
	});

	const actual = shape();
	const expected = {
		key: true,
		key2: {
			deep: {
				deeper: {
					deepest: true,
				},
			},
		},
	};

	expect(actual).toEqual(expected);
});
