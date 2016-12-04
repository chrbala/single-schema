// @flow

export const isPromise = (value: *) => value === Promise.resolve(value);
export const checkIfErrors = (output: *) => 
	Object.keys(output).length ? output : null;
