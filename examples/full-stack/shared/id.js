// @flow

export const serialize = (arg: {id: number, table: string}) => 
	JSON.stringify(arg);
export const deserialize = (serialized: string) => JSON.parse(serialized);
