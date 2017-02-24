// @flow

export const clean = (obj: {[key: string]: *}) => {
	const out = {};
	for (const key in obj)
		if (obj[key] !== null)
			out[key] = obj[key];
	return out;
};
