// @flow

import { EXPECTED_ARRAY } from './strings';

export default (validate: (data: *) => mixed) => (data: *) => {
	if (!Array.isArray(data))
		return EXPECTED_ARRAY;

	let hasErrors = false;
	const errors = data.map(datum => {
		const error = validate(datum);
		if (error)
			hasErrors = true;
		return error;
	});
	return hasErrors ? errors : null;
};
