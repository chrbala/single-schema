// @flow

export const EXTRA_KEY_TEXT = 'unexpected property';
export const MISSING_KEY_TEXT = 'missing property';
export const PROMISE_NOT_PERCOLATED_ERROR = 
	'Asynchronous validators must be percolated upward'
;

type ErrorType = *;
type SuccessType = null;
type ReturnType = ErrorType | SuccessType;

type ReducerType = (data: *) => ReturnType;
type AsyncReducerType = (data: *) => Promise<ReturnType>;

type WrapperType = (reduce: ReducerType) => (errors: ReturnType) => ReturnType;
type AsyncWrapperType = (reduce: AsyncReducerType) => 
	(errors: ReturnType) => Promise<ReturnType>
;

const isPromise = value => value === Promise.resolve(value);
const throwIfAsync = fn => {
	if (isPromise(fn(undefined)))
		throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
};
const checkIfErrors = output => Object.keys(output).length ? output : null;

export const NonNull: WrapperType = 
	reduce => {
		throwIfAsync(reduce);

		return value => value !== undefined && value !== null
			? reduce(value)
			: MISSING_KEY_TEXT
		;
	};

export const Permissive: WrapperType = reduce => {
	throwIfAsync(reduce);

	return value => {
		const out = {};
		const result = reduce(value);
		if (!result)
			return result;

		if (typeof result === 'string') {
			if (result == EXTRA_KEY_TEXT)
				return null;
			return result;
		}
		
		for (const key in result)
			if (result[key] !== EXTRA_KEY_TEXT)
				out[key] = result[key];
		return checkIfErrors(out);
	};
};

export const PermissiveAsync: AsyncWrapperType = reduce => 
	value => Promise.resolve(reduce(value))
		.then(syncValue => Permissive(f => f)(syncValue))
;

type CombineReducersType = 
	(isAsync: boolean) =>
		(props: {[key: string]: ReducerType}) => 
			(data: *) => ReturnType
;

const combineReducersBuilder: CombineReducersType = isAsync => props => {
	let lastInput;
	let lastOutput = {};

	for (const key in props) {
		const reduce = props[key];
		lastOutput = reduce(lastInput);
		if (!isAsync && isPromise(lastOutput))
			throw new Error(PROMISE_NOT_PERCOLATED_ERROR);
	}

	return data => {
		if (!data)
			return isAsync ? Promise.resolve(null) : null;

		const errors = {};

		for (const key in props)
			if (lastOutput && lastInput && (key in lastInput) && (data[key] === lastInput[key])) {
				if (key in lastOutput)
					errors[key] = lastOutput[key];
			} else if (key in data) {
				const reduce = props[key];
				const error = reduce(data[key]);
				if (error !== null) 
					errors[key] = error;
			}

		for (const key in data)
			if (!props[key])
				errors[key] = EXTRA_KEY_TEXT;

		lastInput = data;
		lastOutput = errors;

		if (isAsync) 
			return (async () => {
				const asyncOutput = {};
				for (const key in errors) {
					const error = await errors[key];
					if (error !== null)
						asyncOutput[key] = error;
				}

				return checkIfErrors(asyncOutput);
			})();

		return checkIfErrors(errors);
	};
};

export const combineReducers = combineReducersBuilder(false);
export const combineReducersAsync = combineReducersBuilder(true);
