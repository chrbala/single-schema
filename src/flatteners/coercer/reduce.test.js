// @flow

import createCombineReducers from '../../createCombineReducers';
import Coercer from './';

const combineReducers = createCombineReducers({
	coerce: Coercer(),
});

const coerceString = {
	coerce: data => String(data),
};

it('Basic coercion', () => {
	const { coerce } = combineReducers({
		key: coerceString,
	});

	const actual = coerce({
		key: 123,
	});
	const expected = {
		key: '123',
	};

	expect(actual).toEqual(expected);
});

it('Removes extra keys', () => {
	const { coerce } = combineReducers({
		key: coerceString,
	});

	const actual = coerce({
		key: 123,
		extraKey: 456,
	});
	const expected = {
		key: '123',
	};

	expect(actual).toEqual(expected);
});
