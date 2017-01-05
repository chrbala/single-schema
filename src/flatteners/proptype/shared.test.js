// @flow

import React from 'react';

import createCombineReducers from '../../createCombineReducers';
import PropType from './';
import Validator from '../validator';

const combineReducers = createCombineReducers({
	proptype: PropType(),
	validate: Validator(),
});

const IS_STRING_ERROR = 'Must be string';
const isString = {
	validate: value => typeof value == 'string'
	? null
	: IS_STRING_ERROR,
};

// $FlowFixMe
console.error = error => {
	throw error;
};

it('Passing validation', () => {
	const { proptype } = combineReducers({
		key: isString,
	});

	const Component = () => <div />;
	Component.propTypes = {
		test: proptype(),
	};

	const data = {
		key: 'hello',
	};

	expect(() => <Component test={data} />).not.toThrow();
});

it('Failing validation', () => {
	const { proptype } = combineReducers({
		key: isString,
	});

	const Component = () => <div />;
	Component.propTypes = {
		test: proptype(),
	};

	const data = {
		key: 123,
	};

	expect(() => <Component test={data} />).toThrowError(IS_STRING_ERROR);
});

it('Correctly passes options object to validate', () => {
	expect.assertions(1);
	const OPTIONS = {};

	const combineWithMockedValidate = createCombineReducers({
		proptype: PropType(),
		validate: {
			reduce: () => () => (data, options) => expect(options).toBe(OPTIONS),
		},
	});

	const { proptype } = combineWithMockedValidate({});

	proptype(OPTIONS)({});
});
