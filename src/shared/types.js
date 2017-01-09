// @flow

export type GenericObjectType = {
	[key: string]: *,
};

export type AnyFnType = (...args: Array<*>) => *;

// this fixes type coloring after () => * in SublimeText
{};

export type ReducerType<T> = (child: AllReducerType) => 
	(context: FlattenerType<T>) => AnyFnType;

export type AllReducerType = {
	[keys: string]: AnyFnType,
};

export type FlattenerType<T> = {
	reduce: ReducerType<T>,
	[key: string]: (...reducers: Array<?AnyFnType>) => 
		(...context: Array<AllReducerType>) => *,
};

// this fixes type coloring after () => * in SublimeText
{};

export type AllFlattenerType<T> = {[key: string]: FlattenerType<T>};
