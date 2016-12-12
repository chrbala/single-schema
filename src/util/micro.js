// @flow

type IsObjectType = (data: *) => boolean;
export const isObject: IsObjectType = 
	data => data === Object(data);
