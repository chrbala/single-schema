// @flow

type NameType = 'NAME';
export const NAME: NameType = 'NAME';

type ValueType = 'VALUE';
export const VALUE: ValueType = 'VALUE';

type AssertType = {
	type: NameType | ValueType,
	[key: string]: *,
};

export type VariationType = 'input' | 'output';

type WrapperType = () => () => {};

export type ByNameType = {
	type: NameType,
	getName: (type: string) => string,
	register: (value: string, type: string) => void,
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

export type ConfigType = {
	name: string,
	fields?: {},
	[key: string]: *,
};
export type StoreType = {
	set: (name: string, graphQLObject: {}) => mixed,
	get: (key: string) => () => {},
};
export type InitialConfigType = {|
	store: StoreType,
	graphql: {[key: string]: *},
|};
