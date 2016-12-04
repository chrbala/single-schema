// @flow

type ErrorType = *;
type SuccessType = null;
type ReturnType = ErrorType | SuccessType;
type ReducerType = (data: *) => ReturnType;
type AsyncReducerType = (data: *) => Promise<ReturnType>;
export type WrapperType = (reducer: ReducerType) => ReducerType;
export type AsyncWrapperType = (reducer: (data: *) => *) => AsyncReducerType;

export type CombineReducersType = 
	(isAsync: boolean) =>
		(props: {[key: string]: ReducerType}) => 
			(data: *) => ReturnType
;
