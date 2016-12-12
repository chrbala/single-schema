// @flow

export type GenericObjectType = {
	[key: string]: *,
};

export type AnyFnType = (...args: Array<*>) => *;

// this fixes type coloring after () => * in SublimeText
{};

export type ReducerType<T> = {
	[keys: $Keys<T>]: AnyFnType,
};

export type OptionsType = {
	cache?: boolean,
};
