// @flow

import { deserialize } from 'examples/full-stack/shared/id';
import type { 
	ContextType, 
	NodeType, 
	TableNameType,
} from 'examples/full-stack/shared/types';

type LoadType = (context: ContextType) => (id: string) => NodeType;
export const load: LoadType = ({database}) => serialized => {
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
