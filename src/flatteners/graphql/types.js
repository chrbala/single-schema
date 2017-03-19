// @flow

type NameType = 'NAME';
export const NAME: NameType = 'NAME';

type ValueType = 'VALUE';
export const VALUE: ValueType = 'VALUE';

type AssertType = {
  [key: string]: *,
  type: NameType | ValueType,
};

export type StoredTypesType = 'input' | 'output';
export type VariationType = StoredTypesType | 'interface';

type WrapperType = () => () => {};

export type ByNameType =
  & {
    type: NameType,
    getName: (type: VariationType) => string,
    register: (value: string, type: VariationType) => void,
    getChildren: () => {},
    wrappers: Array<WrapperType>,
  }
  & AssertType;

export type ByValueType =
  & {
    type: ValueType,
    getValue: () => {},
    wrappers: Array<WrapperType>,
  }
  & AssertType;

export type LeafType = Class<*>;

export type OutputType = ByNameType | ByValueType;
export type InputType = LeafType | OutputType;

export type ConfigType = {
  [key: string]: *,
  name: string,
  fields?: {},
};
export type StoreType = {
  set: (name: string, graphQLObject: {}) => mixed,
  get: (key: string) => () => {},
};
export type InitialConfigType = {|
  store: StoreType,
  graphql: { [key: string]: * },
|};
