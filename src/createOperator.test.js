// @flow

import Spy from './helpers/spy';

import createOperator from './createOperator';

(() => {
	const warn = console.warn;
	// $FlowFixMe
	afterEach(() => console.warn = warn);
})();

it('Can create an operator', () => {
	const VALUE = 'VALUE';
	const operator = createOperator('operator')({
		flattener: {
			operator: () => () => () => () => VALUE,
		},
	});
	const { flattener } = operator();
	expect(flattener()).toBe(VALUE);
});

it('Can create an operator with multiple reducers', () => {
	expect.assertions(1);

	const reduce = () => () => null;
	const reducer = {
		flattener: reduce,
	};
	const operator = createOperator('operator')({
		flattener: {
			operator: (...reducers) => () => () => () =>
				expect(reducers).toEqual([reduce, reduce, reduce])
			,
		},
	});
	const { flattener } = operator(reducer, reducer, reducer);
	flattener();
});

it('Operators are provided reducer context', () => {
	expect.assertions(1);

	const reducer = {
		flattener: () => () => null,	
	};
	const operator = createOperator('operator')({
		flattener: {
			operator: () => (...context) => () => () =>
				expect(context).toEqual([reducer, reducer])
			,
		},
	});
	const { flattener } = operator(reducer, reducer);
	flattener();
});

it('Operators warn when missing implementation on flattener', () => {
	expect.assertions(2);

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
	expect(spy.timesRun()).toBe(0);
	flattener();
	expect(spy.timesRun()).toBe(1);
});
