// @flow

export const number = {
	validate: (value: *) => typeof value == 'number'
		? null
		: `Expected number, got ${typeof value}`,
	coerce: (value: *) => Number(value),
};

export const nonNaN = {
	validate: (value: *) => Number.isNaN(value)
		? null
		: 'Unexpected NaN',
};

export const int = {
	validate: (value: *) => Math.floor(value) == value
		? null
		: `Expected int, got ${value}`,
	coerce: (value: *) => Number.parseInt(value, 10),
};

export const nonNegative = {
	validate: (value: *) => value >= 0
		? null
		: `Expected non-negative, got ${value}`,
};
