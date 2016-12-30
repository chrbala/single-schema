// @flow

import { getState } from '../database';
import { deserialize } from './id';

export const resolve = ({id: serialized}: {id: string}) => {
	const { id, table } = deserialize(serialized);

	const state = getState();
	const value = state[table] && state[table][id];
	if (!value)
		throw new Error(`Invalid id ${serialized} provided`);
	
	return {
		id: serialized,
		...value,
	};
};
