// @flow

export default (coerce: ?(data: *) => mixed) => () => (data: *) => {
	if (!coerce)
		return data;

	if (!data)
		return [];

	return Array.prototype.map.call(data, coerce);
};
