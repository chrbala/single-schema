// @flow

export default (validate: ?(data: *) => mixed) => () => () => 
	(data: *, options: *, context: *) =>
		validate 
			&& data !== null 
			&& data !== undefined 
				? validate(data, options, context) 
				: null
			;
