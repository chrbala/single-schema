// @flow

import createOperator from './createOperator';

it('Can create an operator', () => {
	const VALUE = 'VALUE';
	const operator = createOperator('operator')({
		flattener: {
			operator: () => () => () => () => VALUE,
			reduce: () => () => () => () => null,
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
				expect(reducers).toEqual([reduce, reduce, reduce]),
			reduce: () => () => () => () => null,
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
				expect(context).toEqual([reducer, reducer]),
			reduce: () => () => () => () => null,
		},
	});
	const { flattener } = operator(reducer, reducer);
	flattener();
});
