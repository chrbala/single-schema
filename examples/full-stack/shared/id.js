// @flow

type SerializeType = (arg: {id: number, table: string}) => string;
export const serialize: SerializeType = ({id, table}) => 
	JSON.stringify({id, table});
export const deserialize = (serialized: string) => JSON.parse(serialized);
