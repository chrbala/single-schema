// @flow

import reduce from './reduce';
import array from './array';

export default ({cache}: {cache: boolean} = {}) => ({
	reduce: reduce({cache}),
	array,
});
