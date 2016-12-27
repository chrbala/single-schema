// @flow

export default () => {
	const thunks = {};
	const values = {};
	
	const set = (name: string, value: *) => thunks[name] = value;
	const get = (name: string) => {
		if (!values[name])
			if (!thunks[name])
				throw new Error(`${name} not yet registered!`);
			else
				values[name] = thunks[name]();
		return values[name];
	};
	const all = () => ({
		thunks,
		values,
	});
	
	return {
		set,
		get,
		all,
	};
};
