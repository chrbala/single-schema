// @flow

type ErrorType = string | {[key: string]: ErrorType};
type SuccessType = null;
type ReturnType = ErrorType | SuccessType;

/* Wrap section */ 
const allOptions = {
	NON_NULL: 'NON_NULL',
	PERMISSIVE: 'PERMISSIVE',
};
type OptionType = $Keys<typeof allOptions>;

class Wrap {
	options: {[key: OptionType]: boolean};
	value: *;

	constructor(_value: *, newOption: ?OptionType) {
		const { options, value } = Wrap.ensureWrapped(_value);
		this.value = value;
		this.options = newOption ? {...options, [newOption]: true} : options;
	}

	static ensureWrapped(value: *) {
		if (value instanceof Wrap)
			return value;
		return { value, options: {} };
	}
}

type ReducerType = Wrap | (data: *) => ReturnType;

export const NonNull = (value: ReducerType) => 
	new Wrap(value, allOptions.NON_NULL);

export const Permissive = (value: *) => new Wrap(value, allOptions.PERMISSIVE);

/* Reducer section */
export const EXTRA_KEY_TEXT = 'unexpected property';
export const MISSING_KEY_TEXT = 'missing property';

type CombineReducersType = 
	(props: {[key: string]: ReducerType}) => 
		(data: *) => ReturnType;

export const combineReducers: CombineReducersType = _props => data => {
	const { options: propsOptions, value: props } = Wrap.ensureWrapped(_props);

	const errors = {};
	const missing = {};
	const extra = {};

	for (const key in props) {
		const { options: reducerOptions, value: reducer } = Wrap.ensureWrapped(props[key]);

		if (reducerOptions[allOptions.NON_NULL] && !data[key])
			missing[key] = MISSING_KEY_TEXT;
		else if (data[key]) {
			const error = reducer(data[key]);
			if (error)
				errors[key] = error;
		}
	}

	if (!propsOptions[allOptions.PERMISSIVE])
		for (const key in data)
			if (!props[key])
				extra[key] = EXTRA_KEY_TEXT;

	const output = { ...errors, ...missing, ...extra };
	return Object.keys(output).length ? output : null;
};

type AsyncReducerType = (data: *) => ReturnType | Promise<ReturnType>;
type CombineReducersAsyncType = 
	(props: {[key: string]: AsyncReducerType}) => 
		(data: *) => Promise<ReturnType>;

export const combineReducersAsync: CombineReducersAsyncType = () => async () => null;
