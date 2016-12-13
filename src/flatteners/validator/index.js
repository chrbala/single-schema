// @flow

import reduce from './reduce';
import array from './array';

export default ({cache = false}: {cache: boolean} = {}) => ({
	reduce: reduce({cache}),
	array,
});
