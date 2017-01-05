// @flow

export const createPropType = (validate: () => mixed, options: {}) => 
	(props: {}, propName: string, componentName: string) => {
		const createError = error =>
			new Error(`on ${componentName}/${propName}: ${JSON.stringify(error)}`);

		const data = props[propName];
		const error = validate(data, options);
		return error ? createError(error) : null;
	}
;

export const operation = () => () => ({validate}: {validate: () => mixed}) => 
	(options: {}) => createPropType(validate, options)
;
