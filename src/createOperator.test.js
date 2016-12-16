// @flow

import test from 'ava';

import createOperator from './createOperator';

test('Can create an operator', t => {
	const VALUE = 'VALUE';
	const operator = createOperator('operator')({
		flattener: {
			operator: () => () => VALUE,
		},
	});
	const { flattener } = operator();
	t.is(flattener(), VALUE);
});

test('Can create an operator with multiple reducers', t => {
	t.plan(1);

	const reduce = {
		operator: () => () => null,	
	};
	const reducer = {
		flattener: reduce,
	};
	const operator = createOperator('operator')({
		flattener: {
			operator: (...reducers) => () => 
				t.deepEqual(reducers, [reduce, reduce, reduce])
			,
		},
	});
	const { flattener } = operator(reducer, reducer, reducer);
	flattener();
});

test('Can create an operator with sparse reducers', t => {
	t.plan(1);

	const reduce = {
		operator: () => () => null,	
	};
	const reducer = {
		flattener: reduce,
	};
	const operator = createOperator('operator')({
		flattener: {
			operator: (...reducers) => () => 
				t.deepEqual(reducers, [reduce, reduce, reduce])
			,
		},
	});
	const { flattener } = operator(reducer, {}, reducer, {}, reducer);
	flattener();
});
