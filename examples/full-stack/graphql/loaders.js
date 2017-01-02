// @flow

import DataLoader from 'dataloader';

import * as nodeOps from './node';
import type { ContextType } from 'examples/full-stack/shared/types';
import { serialize } from 'examples/full-stack/shared/id';

const LoadAll = (context, node) => table => new DataLoader(
	async () => [context.database.getState()[table].map((value, index) => {
		const id = serialize({id: index, table});
		const valueWithId = { ...value, id };
		node.prime(id, valueWithId);
		return valueWithId;
	})]
);

export default (context: ContextType) => {
	const node = new DataLoader(async keys => keys.map(nodeOps.load(context)));
	const loadAll = LoadAll(context, node);

	return {
		node,
		personAll: loadAll('person'),
		familyAll: loadAll('family'),
	};
};
