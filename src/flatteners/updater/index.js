// @flow

import reduce from './reduce';
import array from './array';

import type { FlattenerType } from '../../shared/types';

type UpdaterType = () => FlattenerType<*>;

const Updater: UpdaterType = () => ({
	reduce,
	array,
});

export default Updater;
