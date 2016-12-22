// @flow

export const string = (value: *) => typeof value == 'string'
	? null
	: 'Must be string'
;
