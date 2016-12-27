// @flow

import reduce from './reduce';
import array from './array';
import map from './map';
import maybe from './maybe';

import type { FlattenerType } from '../../shared/types';

type UpdaterType = () => FlattenerType<*>;

const Updater: UpdaterType = () => ({
	reduce,
	array,
	map,
	maybe,
});

export default Updater;
