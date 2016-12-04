// @flow

type ErrorType = *;
type SuccessType = null;
type ReturnType = ErrorType | SuccessType;
type ReducerFnType = (data: *) => ReturnType | Promise<ReturnType>;
type OtherType = (data: *) => mixed | Promise<mixed>;

export type NormalizedReducerType = {
	validate: ReducerFnType,
	[key: string]: OtherType,
};

export type ReducerType = ReducerFnType | NormalizedReducerType;
export type WrapperType = (reducer: ReducerType) => NormalizedReducerType;

export type CombineReducersType = 
	(isAsync: boolean) =>
		(props: {[key: string]: ReducerType}) => 
			NormalizedReducerType
;
