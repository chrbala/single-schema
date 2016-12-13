// @flow

export default (coerce: (data: *) => mixed) => (data: *) => {
	if (!data)
		return [];

	return Array.prototype.map.call(data, coerce);
};
