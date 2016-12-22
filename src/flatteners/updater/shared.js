// @flow

import { isFrozen } from '../../util/micro';

export const normalizeArray = (value: *, mutates: boolean) =>
	Array.isArray(value) 
		? mutates || !isFrozen(value)
			? [...value] 
			: value
		: []
	;
