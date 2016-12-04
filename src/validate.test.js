// @flow

import test from 'ava';
import { 
	combineReducers, 
	combineReducersAsync, 
	NonNull, 
	Permissive,
	EXTRA_KEY_TEXT,
	MISSING_KEY_TEXT,
} from './validate';

const isString = value => typeof value == 'string'
	? null
	: 'Must be string';

(() => {
	const validate = combineReducers({
		key: isString,
	});

	test('Basic passing validation', t => {
		const actual = validate({
			key: 'value',
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('Basic failing validation', t => {
		const actual = validate({
			key: 'value',
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});
})();

(() => {
	const validate = combineReducers({
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
			key: 123,
			key2: {
				deep: 'value',
			},
		});
		const expected = {
			key: 'Must be string',
		};
		t.deepEqual(actual, expected);
	});
})();

(() => {
	const validate = combineReducers({
		key: isString,
		key2: NonNull(isString),
	});

	test('Missing normal property', t => {
		const actual = validate({
			key: null,
			key2: 'value',
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('Missing NonNull property', t => {
		const actual = validate({
			key: 'value',
			key2: null,
		});
		const expected = {
			key2: MISSING_KEY_TEXT,
		};
		t.deepEqual(actual, expected);
	});
})();

test('Unexpected property', t => {
	const validate = combineReducers({
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

test('Unexpected property on permissive type', t => {
	const validate = combineReducers(Permissive({
		key: isString,
		key2: isString,
	}));

	const actual = validate({
		key: 'value',
		key2: 'value',
		key3: 'value',
	});
	const expected = null;
	t.deepEqual(actual, expected);
});

(() => {
	const validate = combineReducers({
		key: isString,
		key2: value => !value 
			? 'Expected object type'
			: value.match1 == value.match2
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
	const emails = {
		'emailAlreadyExists@gmail.com': true,
	};
	const emailAccountExistsAsync = async email => !!emails[email];

	const validateAsync = combineReducersAsync({
		key: combineReducers({
			deep1: isString,
			deep2: isString,
		}),
		key2: combineReducersAsync({
			name: isString,
			email: email => emailAccountExistsAsync(email)
				.then(accountExists => accountExists
					? 'Email account is already registered.'
					: null
				),
		}),
	});

	test('Async passing validation', async t => {
		const actual = await validateAsync({
			key: {
				deep1: 'value',
				deep2: 'value',
			},
			key2: {
				name: 'bob',
				email: 'emailDoesNotExist@gmail.com',
			},
		});
		const expected = null;
		t.deepEqual(actual, expected);
	});

	test('Async failing validation', async t => {
		const actual = await validateAsync({
			key: {
				deep1: 'value',
				deep2: 'value',
			},
			key2: {
				name: 'bob',
				email: 'emailAlreadyExists@gmail.com',
			},
		});
		const expected = {
			key2: {
				email: 'Email account is already registered.',
			},
		};
		t.deepEqual(actual, expected);
	});
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
