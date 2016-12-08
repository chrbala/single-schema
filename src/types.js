// @flow

export type GenericObjectType = {
	[key: string]: *,
};

export type ReducerType<T> = {
	[keys: $Keys<T>]: () => *,
};
