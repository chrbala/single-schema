// @flow

export default (leafSets: {}) => {
	const out: {[key: string]: *} = {};
	for (const leafSet in leafSets)
		for (const leaf in leafSets[leafSet]) {
			out[leaf] = out[leaf] || {};
			out[leaf][leafSet] = leafSets[leafSet][leaf];
		}
	return out;
};
