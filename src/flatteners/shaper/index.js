// @flow

import reduce from './reduce';
import array from './array';
import and from './and';

type OptionsType = {
	leafNode: *,
};

export default ({leafNode = undefined}: OptionsType = {}) => ({
	reduce: reduce({leafNode}),
	array,
	and: and({leafNode}),
});
