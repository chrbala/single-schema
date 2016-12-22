// @flow

import test from 'ava';

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

test('Passing validation', t => {
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

	t.notThrows(() => <Component test={data} />);
});

test('Failing validation', t => {
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

	const error = t.throws(() => <Component test={data} />);
	t.truthy(error.match(IS_STRING_ERROR));
});
