// @flow

export default (coerce: ?(data: *) => mixed) => () => () => (data: *) =>
	coerce && data !== null && data !== undefined ? coerce(data) : data
;
