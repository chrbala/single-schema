// @flow

export default (validate: ?(data: *) => mixed) => () => () => (data: *) =>
	validate && data !== null && data !== undefined ? validate(data) : null
;
