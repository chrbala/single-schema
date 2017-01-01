// @flow

import DataLoader from 'dataloader';

import * as node from './node';
import type { ContextType } from 'examples/full-stack/shared/types';

export default (context: ContextType) => ({
	node: new DataLoader(async keys => keys.map(node.load(context))),
});
