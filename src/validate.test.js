// @flow

import test from 'ava';

import { combineReducers, combineReducersAsync } from './validate';
import { isAsync } from './util';
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

test('Caches simple results when called with identical data', t => {
	let count = 0;
	const keyValidator = () => (count++, null);
	const { validate } = combineReducers({
		key: keyValidator,
	});
	t.is(count, 1);

	const data = {key: 'value'};
	validate(data);
	t.is(count, 2);

	validate(data);
	t.is(count, 2);
});

test('Invalidate cache when data changes', t => {
	let count = 0;
	const keyValidator = () => (count++, null);
	const { validate } = combineReducers({
		key: keyValidator,
	});
	t.is(count, 1);

	validate({key: 'value'});
	t.is(count, 2);

	validate({key: 'hello'});
	t.is(count, 3);
});

test('Reruns fragments of complex data types when data changes', t => {
	let shallowCount = 0;
	const shallowValidator = () => (shallowCount++, null);

	let deepCount = 0;
	const deepValidator = () => (deepCount++, null);

	const { validate } = combineReducers({
		shallow: shallowValidator,
		key: combineReducers({
			deep: deepValidator,
		}),
	});
	t.is(shallowCount, 1);
	t.is(deepCount, 1);

	let data = {
		shallow: 'value',
		key: {
			deep: 'value',
		},
	};
	validate(data);
	t.is(shallowCount, 2);
	t.is(deepCount, 2);

	data = { ...data, key: { deep: 'hello' }};
	validate(data);
	t.is(shallowCount, 2);
	t.is(deepCount, 3);
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

test('Async reducers create async validator', t => {
	const { validate } = combineReducersAsync({});
	t.true(isAsync(validate));
});

(() => {
	const emails = {
		'emailAlreadyExists@gmail.com': true,
		'anotherEmailAlreadyExists@gmail.com': true,
	};
	const EMAIL_EXISTS_ERROR = 'Email account is already registered.';
	const emailAccountExistsAsync = async email => email && emails[email]
		? EMAIL_EXISTS_ERROR
		: null
	;

	(() => {
		const { validate } = combineReducersAsync({
			key: combineReducersAsync({
				name: isString,
				email: emailAccountExistsAsync,
			}),
		});

		test('Async passing validation with depth 2', async t => {
			const actual = await validate({
				key: {
					name: 'bob',
					email: 'emailDoesNotExist@gmail.com',
				},
			});
			const expected = null;
			t.deepEqual(actual, expected);
		});

		test('Async failing validation with depth 2', async t => {
			const actual = await validate({
				key: {
					name: 'bob',
					email: Object.keys(emails)[0],
				},
			});
			const expected = {
				key: {
					email: EMAIL_EXISTS_ERROR,
				},
			};
			t.deepEqual(actual, expected);
		});
	})();

	(() => {
		const { validate } = combineReducersAsync({
			email: emailAccountExistsAsync,
			secondaryEmail: emailAccountExistsAsync,
		});

		test('Async passing validation with multiple keys', async t => {
			const actual = await validate({
				email: 'emailDoesNotExist@gmail.com',
				secondaryEmail: 'emailDoesNotExist@gmail.com',
			});
			const expected = null;
			t.deepEqual(actual, expected);
		});

		test('Async single failure on validation with multiple keys', async t => {
			const actual = await validate({
				email: Object.keys(emails)[0],
				secondaryEmail: 'emailDoesNotExist@gmail.com',
			});
			const expected = {
				email: EMAIL_EXISTS_ERROR,
			};
			t.deepEqual(actual, expected);
		});

		test('Async multiple failure on validation with multiple keys', async t => {
			const actual = await validate({
				email: Object.keys(emails)[0],
				secondaryEmail: Object.keys(emails)[1],
			});
			const expected = {
				email: EMAIL_EXISTS_ERROR,
				secondaryEmail: EMAIL_EXISTS_ERROR,
			};
			t.deepEqual(actual, expected);
		});
	})();
})();

test('combineReducersAsync must percolate up', t => {
	t.throws(() => {
		combineReducers({
			key: combineReducersAsync({}),
		});
	});
});

test('Promises on keys should percolate up to combineReducersAsync', t => {
	t.throws(() => {
		combineReducers({
			key: async () => null,
		});
	});
});
