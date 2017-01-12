# Validator

The Validator determines if the data provided is compliant with the schema. It will return null if there is no error. If there are errors, it will give an error object in the shape of the schema.

## Setup
```javascript
import create from 'single-schema';
import Validator from 'single-schema/flatteners/validate';

const flatteners = {
	validate: Validator(),
};

const { combine, array, map, and, maybe } = create(flatteners);
```

## Leaves
A leaf for a coercer takes in a value, returning a best-attempt to make the value fit the type.

```javascript
const string = {
	validate: value => typeof value == 'string'
	? null
	: 'Must be string',
};
```

## Operators

### Combine

Coerces all of the keys in an object. It drops extra keys from the result. If a child reducer does not have a validation function, the value is assumed to be valid.

```javascript
const { validate } = combine({
	key: string,
});

/*
returns: {
	key: 'Must be string',
};
*/
validate({
	key: 123,
});

/*
returns: {
	key2: 'unexpected property',
};
*/
validate({
	key: 'value',
	key2: 'value',
});

// returns: 'expected object type'
validate(undefined);
```

### Array

Coerces all of the elements of an array to its type.

```javascript
const { validate } = array(string);

// returns: [null, 'Must be string']
const actual = validate(['hello', 123]);

// returns: null
validate(['hello', 'whatever']);

// returns: 'expected array type'
const actual = validate('something');
```

### Map

Coerces all of the keys in an object to its type.

```javascript
const { validate } = map(string);

/*
returns: {
	key2: 'Must be string',
}
*/
validate({
	key1: '123',
	key2: 123,
});

// returns: null
validate({key: '123'});

// returns: 'expected object type'
validate('something');
```

### Maybe

Undefined and null values are considered valid with maybe types

```javascript
const { validate } = maybe(string);

// returns: 'Must be string'
validate(12345);

// returns: null
validate(undefined);

// returns: null
validate(null);
```

You can also create recursive data shapes with a thunk.

```javascript
const node = combine(() => ({
	value: isString,
	next: maybe(node),
}));

/*
returns: {
	next: {
		next: {
			value: 'Must be string',
		},
	},
}
*/
node.validate({
	value: 'one',
	next: {
		value: 'two',
		next: {
			value: 123,
			next: null,
		},
	},
});
```

### And

Runs all the provided coercers in sequence.

```javascript
const string = {
	validate: value => typeof value == 'string'
	? null
	: 'Must be string',
};

const maxLength = length => ({
	validate: data => data.length <= length
		? null
		: 'Too long!',
});

const { validate } = and(string, maxLength(3));

// returns: 'Must be string'
validate(12345);

// returns: 'Too long!'
validate('12345');

// returns: null
validate('123');
```