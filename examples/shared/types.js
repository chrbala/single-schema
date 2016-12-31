// @flow

export interface NodeType {
	id: string,
};

export type PointerType = string;

type PersonType = {
	name: string,
};

type PeopleType = Array<PointerType>;
type FamilyType = {
	adults: PeopleType,
	children: PeopleType,
};

export type TableNameType = 'person' | 'family';

type StateType = {
	person: Array<PersonType>,
	family: Array<FamilyType>,
} & {
	[key: TableNameType]: *,
};

type UpdateLeafType = {
	[key: string]: () => mixed,
};
type UpdateType<T> = (propName: T) => UpdateType<string> & UpdateLeafType;

type DatabaseType = {
	getState: () => StateType,
	update: UpdateType<TableNameType>,
};

export type ContextType = {
	database: DatabaseType,
};
