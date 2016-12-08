// @flow

import test from 'ava';

import { combineReducers } from './defaultCombineReducers';
import { EXTRA_KEY_TEXT } from './strings';

const IS_STRING_ERROR = 'Must be string';
const isString = value => typeof value == 'string'
	? null
	: IS_STRING_ERROR;

(() => {
	const { validate } = combineReducers({
		key: isString,
		key2: isString,
	});

	test('Basic passing validation', t => {
		const actual = validate({
			key: 'value',
			key2: 'value',
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('Basic failing validation', t => {
		const actual = validate({
			key: 'value',
			key2: 123,
		});
		const expected = {
			key2: IS_STRING_ERROR,
		};
		t.deepEqual(actual, expected);
	});

	test('Basic failing validation with multiple keys', t => {
		const actual = validate({
			key: 123,
			key2: 456,
		});
		const expected = {
			key: IS_STRING_ERROR,
			key2: IS_STRING_ERROR,
		};
		t.deepEqual(actual, expected);
	});
})();

test('Top level undefined passes', t => {
	const { validate } = combineReducers({
		key: isString,
	});
	const actual = validate(undefined);
	const expected = null;
	t.deepEqual(actual, expected);
});

(() => {
	const { validate } = combineReducers({
		key: isString,
		key2: combineReducers({
			deep: isString,
		}),
	});

	test('Nested passing validation', t => {
		const actual = validate({
			key: 'value',
			key2: {
				deep: 'value',
			},
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('Nested failing validation', t => {
		const actual = validate({
			key: 'value',
			key2: {
				deep: 123,
			},
		});
		const expected = {
			key2: {
				deep: IS_STRING_ERROR,
			},
		};
		t.deepEqual(actual, expected);
	});
})();

test('Unexpected property', t => {
	const { validate } = combineReducers({
		key: isString,
		key2: isString,
	});

	const actual = validate({
		key: 'value',
		key2: 'value',
		key3: 'value',
	});
	const expected = {
		key3: EXTRA_KEY_TEXT,
	};
	t.deepEqual(actual, expected);
});

(() => {
	const { validate } = combineReducers({
		key: isString,
		key2: value => !value 
			? 'Expected object type'
			: value.match1 === value.match2
				? null
				: 'Expected match1 and match2 to match',
	});

	test('Custom validator passing', t => {
		const actual = validate({
			key: 'value',
			key2: {
				match1: 'hi',
				match2: 'hi',
			},
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('Custom validator failing', t => {
		const actual = validate({
			key: 'value',
			key2: {
				match1: 'hi',
				match2: 'bye',
			},
		});
		const expected = {
			key2: 'Expected match1 and match2 to match',
		};
		t.deepEqual(actual, expected);
	});
})();

(() => {
	const shapeReducer = {
		validate: () => null,
	};

	test('Basic shape', t => {
		const { shape } = combineReducers({
			key: shapeReducer,
			key2: shapeReducer,
		});

		const actual = shape();
		const expected = {
			key: true,
			key2: true,
		};

		t.deepEqual(actual, expected);
	});

	test('Deep shape', t => {
		const { shape } = combineReducers({
			key: shapeReducer,
			key2: combineReducers({
				deep: combineReducers({
					deeper: combineReducers({
						deepest: shapeReducer,
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

		t.deepEqual(actual, expected);
	});
})();
