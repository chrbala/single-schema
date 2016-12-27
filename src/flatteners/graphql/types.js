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

export type ConfigType = {
	name: string,
	fields?: {},
	[key: string]: *,
};
export type GetChildType = (name: string) => string;
type GraphqlAnyType = *;
export type StoreType = {
	set: (name: string, graphQLObject: {}) => mixed,
	get: (key: string) => () => {},
};
type VariationType = {
	createName: (rawName: string) => string,
	build: (GraphqlConfig: ConfigType) => GraphqlAnyType,
	getChildName: GetChildType,
};
export type InitialConfigType = {|
	store: StoreType,
	variations: Array<VariationType>,
	graphql: {[key: string]: *},
|};
