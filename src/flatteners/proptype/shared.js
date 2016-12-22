// @flow

export const createPropType = (validate: () => mixed) => 
	(props: {}, propName: string, componentName: string) => {
		const createError = error =>
			new Error(`on ${componentName}/${propName}: ${JSON.stringify(error)}`);

		const data = props[propName];
		const error = validate(data);
		return error ? createError(error) : null;
	}
;

export const operation = () => () => ({validate}: {validate: () => mixed}) => 
	createPropType(validate)
;
