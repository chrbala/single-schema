// @flow

import DataLoader from 'dataloader';

import * as nodeOps from './node';
import type { ContextLoaderType } from 'examples/full-stack/shared/types';

export default (context: ContextLoaderType) => ({
	node: new DataLoader(async keys => keys.map(nodeOps.load(context))),
});
