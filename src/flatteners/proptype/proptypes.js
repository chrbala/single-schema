// @flow

import { PropTypes } from 'react';

import { mapObj } from '../../util/micro';

const wrapFn = (fn: () => mixed) => (...args: Array<*>) => fn(...args);

export default mapObj(PropTypes, child => {
	const optional = wrapFn(child);

	// some proptypes don't have a required version
	const required = wrapFn(child.isRequired || child);
	optional.isRequired = required;
	required.isOptional = optional;

	return required;
});
