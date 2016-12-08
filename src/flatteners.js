// @flow

import { Iterator } from './iterator';
import { EXTRA_KEY_TEXT } from './strings';

const clean = obj => {
	const out = {};
	for (const key in obj)
		if (obj[key] !== null)
			out[key] = obj[key];
	return out;
};

export const Validator = ({cache} = {}) => children => {
	const iterate = Iterator(cache);

	return data => {
		if (!data)
			return null;

		const out = clean(iterate(children, data, 
			(child, datum) => child(datum)
		));

		for (const key in data)
			if (!children[key])
				out[key] = EXTRA_KEY_TEXT;

		return Object.keys(out).length ? out : null;
	};
};

const subset = (obj1, obj2) => {
	const out = {};
	for (const key in obj2) 
		out[key] = obj1[key];
	return out;
};
export const Coercer = ({cache} = {}) => children => {
	const iterate = Iterator(cache);

	return data => iterate(subset(children, data), data, 
		(child, datum) => child ? child(datum) : datum
	);
};

export const Shaper = () => children => () => {
	const out = {};
	for (const key in children) {
		const child = children[key];
		out[key] = child ? child() : true;
	}
	return out;
};
