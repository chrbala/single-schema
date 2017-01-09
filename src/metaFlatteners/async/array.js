// @flow

import type { FlattenerType } from '../../shared/types';

export default ({array}: FlattenerType<*>) =>
	(child: *) => (context: *) => (flatteners: *) => 
		(data?: [] = [], ...rest: Array<*>) =>
			child
				? Promise.all(data.map(datum => child(datum, ...rest)))
					.then(_data => array(f => f)(context)(flatteners)(_data, ...rest))
				: array(child)(context)(flatteners)(data, ...rest)
		;
