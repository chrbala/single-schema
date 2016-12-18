// @flow

import reduce from './reduce';
import array from './array';

import type { FlattenerType } from '../../shared/types';

type OptionsType = {
	leafNode: *,
};

type ShaperType = (options: *) => FlattenerType<*>;

const Shaper: ShaperType = ({leafNode = undefined}: OptionsType = {}) => ({
	reduce: reduce({leafNode}),
	array,
});

export default Shaper;
