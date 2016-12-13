// @flow

export default (operator: string) => 
	(flatteners: *) => (reducer: *) => {
		const out = {};
		for (const flattenerName in flatteners)
			out[flattenerName] = flatteners[flattenerName][operator](reducer[flattenerName]);
		return out;
	};
