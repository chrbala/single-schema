// @flow

import reduce from './reduce';
import array from './array';
import and from './and';

export default ({cache}: {cache: boolean} = {}) => ({
	reduce: reduce({cache}),
	array,
	and,
});
