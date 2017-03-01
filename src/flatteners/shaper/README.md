# Shaper

The Shaper creates a shape that reflects the schema.

## Setup
```javascript
import create from 'single-schema/lib';
import Shaper from 'single-schema/lib/flatteners/shaper';

const flatteners = {
	shape: Shaper(),
};

const { combine, array, map, maybe } = create(flatteners);
```

## Leaves
A leaf for a coercer takes in a value, returning a best-attempt to make the value fit the type.

```javascript
const string = {
	shape: () => '',
};
```

## Operators

### Combine

Creates an object with keys equivalent to its children's shape functions.

```javascript
const { shape } = combine({
	key: string,
});

/*
returns: {
	key: '',
}
*/
shape();

```

### Array

Returns an empty array.

```javascript
const { shape } = array(string);

// returns: []
shape();
```

### Map

Returns an empty object.

```javascript
const { shape } = map(string);

// returns: {}
shape();
```

### Maybe

Returns undefined. If a maybe type is a child of a combine(), the key is dropped.

```javascript
const { maybe } = maybe(string);

// returns: undefined
maybe();
```

You can also create recursive data shapes with a thunk.

```javascript
const node = combine(() => ({
	value: isString,
	next: maybe(node),
}));

/*
returns: {
	value: '',
}
*/
node.shape();
```

### And

Shaper does not support the and operator. 