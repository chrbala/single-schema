// @flow

export default (...validators: Array<?(data: *) => mixed>) => () => (data: *) =>
	validators
		.filter(validator => validator)
		.reduce(
			(acc, validator) => acc || (validator ? validator(data) : null)
		, null);
