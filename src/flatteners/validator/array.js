// @flow

import { freeze } from '../../util/micro';
import { EXPECTED_ARRAY } from './strings';

export default (validate: ?(data: *) => mixed) => () => () => 
	(data: *, options: *) => {
		if (!validate)
			return null;

		if (!Array.isArray(data))
			return EXPECTED_ARRAY;

		let hasErrors = false;
		const errors = data.map(datum => {
			const error = validate && validate(datum, options);
			if (error)
				hasErrors = true;
			return error;
		});
		return hasErrors ? freeze(errors) : null;
	}
;
