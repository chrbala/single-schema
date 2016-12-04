// @flow

type ErrorType = *;
type SuccessType = null;
type ReturnType = ErrorType | SuccessType;
type ReducerFnType = (data: *) => ReturnType;
type AsyncReducerFnType = (data: *) => Promise<ReturnType>;

type CoerceType = (data: *) => mixed;
type AsyncCoerceType = (data: *) => Promise<mixed>;

type NormalizedReducerType = { 
	reduce: ReducerFnType,
	coerce: CoerceType,
};
type AsyncNormalizedReducerType = { 
	reduce: AsyncReducerFnType,
	coerce: AsyncCoerceType,
};

export type ReducerType = ReducerFnType | NormalizedReducerType;
export type AsyncReducerType = AsyncReducerFnType | AsyncNormalizedReducerType;

export type WrapperType = (reducer: ReducerType) => ReducerFnType;
export type AsyncWrapperType = (reducer: ReducerType) => AsyncReducerFnType;

export type CombineReducersType = 
	(isAsync: boolean) =>
		(props: {[key: string]: ReducerType}) => 
			(data: *) => ReturnType
;
