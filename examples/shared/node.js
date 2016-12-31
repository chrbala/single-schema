// @flow

import { deserialize } from './id';
import type { ContextType, NodeType, TableNameType } from '../shared/types';

type ResolveType = (
	pointer: {id: string}, 
	context: ContextType
) => NodeType;
export const resolve: ResolveType = ({ id: serialized }, {database}) => {
	try {
		const { id, table } = deserialize(serialized);
		const state = database.getState();
		if (!state[table] || !(id in state[table]))
			throw new Error();

		return {
			...state[table][id],
			id: serialized,
		};
	} catch (e) {
		throw new Error(`Invalid id ${serialized} provided`);
	}
};

export const isTypeOf = (table: TableNameType) => 
	({id: serializedId}: NodeType) => {
		const { table: dataTable } = deserialize(serializedId);
		return table == dataTable;
	};
