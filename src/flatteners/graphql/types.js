// @flow

type NameType = 'NAME';
export const NAME: NameType = 'NAME';

type ValueType = 'VALUE';
export const VALUE: ValueType = 'VALUE';

type AssertType = {
	type: NameType | ValueType,
	[key: string]: *,
};

type WrapperType = () => () => {};

export type ByNameType = {
	type: NameType,
	getName: () => string,
	register: (value: *) => void,
	getChildren: () => {},
	wrappers: Array<WrapperType>,
} & AssertType;

export type ByValueType = {
	type: ValueType,
	getValue: () => {},
	wrappers: Array<WrapperType>,
} & AssertType;

export type LeafType = Class<*>;

export type OutputType = ByNameType | ByValueType;
export type InputType = LeafType | OutputType;
