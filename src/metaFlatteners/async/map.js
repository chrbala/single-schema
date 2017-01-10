// @flow

import type { FlattenerType } from '../../shared/types';
import { mapObj } from '../../util/micro';

const allPromiseObj = obj => {
	const out = {};
	const promises = [];
	for (const key in obj)
		promises.push(Promise.resolve(obj[key]).then(result => out[key] = result));

	return Promise.all(promises).then(() => out);
};

export default ({map}: FlattenerType<*>) =>
	(child: *) => (context: *) => (flatteners: *) => 
		(data?: {} = {}, ...rest: Array<*>) =>
			child
				? allPromiseObj(mapObj(data, datum => child(datum, ...rest)))
					.then(result => map(f => f)(context)(flatteners)(result, ...rest))
				: map(child)(context)(flatteners)(data, ...rest)
		;
