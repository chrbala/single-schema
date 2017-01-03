// @flow

export interface NodeType {
	id: string,
};

export type PointerType = {id: string};

export type TableNameType = 'person' | 'family';

type StateType = {
	[key: TableNameType]: *,
};

type UpdateLeafType = {
	[key: string]: () => mixed,
};
type UpdateType<T> = (propName: T) => 
	UpdateType<string> & UpdateLeafType
;

type DatabaseType = {
	getState: () => StateType,
	update: UpdateType<TableNameType>,
};

export type ContextLoaderType = {
	database: DatabaseType,
};

export type ContextType = ContextLoaderType & {
	loaders: {
		node: () => Promise<mixed>,
	},
};
