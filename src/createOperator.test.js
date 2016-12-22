// @flow

import test from 'ava';
import Spy from './helpers/spy';

import createOperator from './createOperator';

(() => {
	const warn = console.warn;
	// $FlowFixMe
	test.afterEach(() => console.warn = warn);
})();

test('Can create an operator', t => {
	const VALUE = 'VALUE';
	const operator = createOperator('operator')({
		flattener: {
			operator: () => () => () => () => VALUE,
		},
	});
	const { flattener } = operator();
	t.is(flattener(), VALUE);
});

test('Can create an operator with multiple reducers', t => {
	t.plan(1);

	const reduce = () => () => null;
	const reducer = {
		flattener: reduce,
	};
	const operator = createOperator('operator')({
		flattener: {
			operator: (...reducers) => () => () => () =>
				t.deepEqual(reducers, [reduce, reduce, reduce])
			,
		},
	});
	const { flattener } = operator(reducer, reducer, reducer);
	flattener();
});

test('Operators are provided reducer context', t => {
	t.plan(1);

	const reducer = {
		flattener: () => () => null,	
	};
	const operator = createOperator('operator')({
		flattener: {
			operator: () => (...context) => () => () =>
				t.deepEqual(context, [reducer, reducer])
			,
		},
	});
	const { flattener } = operator(reducer, reducer);
	flattener();
});

test('Operators warn when missing implementation on flattener', t => {
	t.plan(2);

	const spy = Spy();
	// $FlowFixMe
	console.warn = spy;

	const reducer = {
		flattener: () => () => null,	
	};
	const operator = createOperator('operator')({
		flattener: {

		},
	});
	const { flattener } = operator(reducer, reducer);
	t.is(spy.timesRun(), 0);
	flattener();
	t.is(spy.timesRun(), 1);
});
