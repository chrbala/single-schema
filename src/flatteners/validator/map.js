// @flow

import { freeze, mapObj } from '../../util/micro';
import { EXPECTED_OBJECT } from './strings';
import { clean } from './shared';

export default (validate: ?(data: *) => mixed) => () => () => (data: *) => {
	if (!validate)
		return null;

	if (!data || data.constructor !== {}.constructor)
		return EXPECTED_OBJECT;

	let hasErrors = false;
	const errors = mapObj(data, datum => {
		const error = validate && validate(datum);
		if (error)
			hasErrors = true;
		return error;
	});
	return hasErrors ? freeze(clean(errors)) : null;
};
