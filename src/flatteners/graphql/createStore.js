// @flow

export default () => {
	const thunks = {};
	const values = {};
	
	const set = (name: string, value: *) => thunks[name] = value;
	const get = (name: string) => {
		if (!values[name])
			values[name] = thunks[name]();
		return values[name];
	};
	
	return {
		set,
		get,
	};
};
