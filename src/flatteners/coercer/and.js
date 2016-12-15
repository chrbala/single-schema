// @flow

export default (...coercers: Array<(data: *) => mixed>) => (data: *) =>
	coercers.reduce(
		(acc, coercer) => coercer(acc)
	, data);
