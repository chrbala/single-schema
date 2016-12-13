// @flow

export default (operator: string) => 
	flatteners => reducer => {
		const out = {};
		for (const key in flatteners)
			out[key] = flatteners[key][operator](reducer);
		return out;
	};
