// @flow

import reduce from './reduce';
import array from './array';

type OptionsType = {
	leafNode: *,
};

export default ({leafNode = undefined}: OptionsType = {}) => ({
	reduce: reduce({leafNode}),
	array,
});
