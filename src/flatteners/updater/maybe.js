// @flow

import reduce from './reduce';

export default (child: ?(data: *) => mixed) => () => 
	child
		? child
		: reduce({}, {})
	;
