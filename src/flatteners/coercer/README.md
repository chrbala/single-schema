# Coercer

The Coercer attempts to transform invalid data to data compliant with the schema. 

## Setup
```javascript
import create from 'single-schema/lib';
import Coercer from 'single-schema/lib/flatteners/coercer';

const flatteners = {
	coercer: Coercer(),
};

const { combine, array, map, and, maybe } = create(flatteners);
```

## Leaves
A leaf for a coercer takes in a value, returning a best-attempt to make the value fit the type.

```javascript
const string = {
	coerce: data => String(data),
};
```

## Operators

### Combine

Coerces all of the keys in an object. It drops extra keys from the result. If a child reducer does not have a coercion function, the original value is used.

```javascript
const { coerce } = combine({
	key: string,
});

/*
returns: {
	key: '123',
};
*/
coerce({
	key: 123,
	extraKey: 456,
});
```

### Array

Coerces all of the elements of an array to its type.

```javascript
const { coerce } = array(string);

// returns: ['123', 'whatever', 'null', 'undefined']
coerce([123, 'whatever', null, undefined]);

// returns: []
coerce(undefined);

// returns: ['hello']
coerce({
	'0': 'hello',
	length: 1,
});
```

### Map

Coerces all of the keys in an object to its type.

```javascript
const { coerce } = map(string);

/* 
returns: {
	key: '123',
};
*/
coerce({
	key: 123,
});

// returns: {}
coerce(undefined);
```

### Maybe

Undefined and null values are considered valid with maybe types

```javascript
const { coerce } = maybe(string);

// returns: 'hello'
coerce('hello');

// returns: undefined
coerce(undefined);

// returns: null
coerce(null);
```

You can also create recursive data shapes with a thunk.

```javascript
const node = combine(() => ({
	value: string,
	next: maybe(node),
}));

/*
returns: {
	value: 'one',
	next: {
		value: 'two',
		next: {
			value: '123',
			next: null,
		},
	},
}
*/
node.coerce({
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
	coerce: data => String(data),
};
const maxLength = length => ({
	coerce: data => data.slice(0, length),
});

const { coerce } = and(isString, maxLength(3));

// returns: '123'
coerce(12345);
```