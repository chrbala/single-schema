// @flow

import DataLoader from 'dataloader';

import * as node from '../shared/node';
import type { ContextType } from '../shared/types';

export default (context: ContextType) => ({
	node: new DataLoader(async keys => keys.map(node.load(context))),
});
