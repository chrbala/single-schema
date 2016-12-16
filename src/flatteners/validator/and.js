// @flow

export default (...validators: Array<(data: *) => mixed>) => (data: *) =>
	validators.reduce(
		(acc, validator) => acc || validator(data)
	, null);
