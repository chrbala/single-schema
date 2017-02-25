# Updater

The updater helps update state immutably. When in development, the returned state tree will be frozen with Object.freeze. Updater returns a function that takes an object of the following shape:

```javascript  
type CreateUpdateParamType {  
	getState: () => StateType,
	subscribe: (
		state: StateType, 
		path: Array<string>, 
		value: ValueType,
	) => void, 
}
```

Where StateType is an object that matches the schema type. subscribe is a callback where the first argument is a the existing shape with a change applied to it. ValueType is the change applied to the state, and the path is a series of keys that show where the change took place.

## Setup
```javascript
import create from 'single-schema';
import Updater from 'single-schema/flatteners/updater';

const flatteners = {
	createUpdate: Updater(),
};

const { combine, array, map, and, maybe } = create(flatteners);
```

## Leaves
Leaves do not need to be defined for the Updater.

```javascript
const string = {};
```

## Operators

### Combine

Updates an object type immutably.

```javascript
const { createUpdate } = combine({
	key: string,
});

let state = {};
const getState = () => state;
const subscribe = newState => state = newState;
const update = createUpdate({getState, subscribe});

update.set({key: 'one'});
// state is now: {key: 'one'}

update('key').set('two');
// state is now: {key: two}

update('bogus') // this throws

```

### Array

Updates an array immutably.

```javascript
const { createUpdate } = array(string);

let state = [];
const getState = () => state;
const subscribe = newState => state = newState;
const update = createUpdate({getState, subscribe});

update.set(['one']);
// state is now: ['one']

update(1).set('ONE');
// state is now: ['ONE']

update.push('TWO');
// state is now ['ONE', 'TWO']
```

Arrays support the following operations, provided the environment has these actions on the array prototype:

* push
* pop
* shift
* unshift
* splice
* copyWithin
* fill
* reverse
* sort

### Map

Updates a map immutably.

```javascript
const { createUpdate } = map(string);

let state = {};
const getState = () => state;
const subscribe = newState => state = newState;
const update = createUpdate({getState, subscribe});

update.set({key: 'one'});
// state is now: {key: 'one'}

update('key').set('ONE');
// state is now: {key: 'ONE'}
```

### Maybe

A simple passthrough operator. It does not change the way Updater behaves.

```javascript
const { createUpdate } = combine({
	key: maybe(string),
});

let state = {};
const getState = () => state;
const subscribe = newState => state = newState;
const update = createUpdate({getState, subscribe});

update.set({key: 'one'});
// state is now: {key: 'one'}

update('key').set('ONE');
// state is now: {key: 'ONE'}
```

This is also compatible with recursive data shapes.

```javascript
const node = combine(() => ({
	value: string,
	next: node,
}));

let state = {
	value: 'hello',
	next: {
		value: null,
		next: null,
	},
};
const getState = () => state;
const subscribe = newState => state = newState;
const update = createUpdate({getState, subscribe});

update('next')('value').set('goodbye');
/*
state is now: {
	value: 'hello',
	next: {
		value: 'goodbye',
		next: null,
	},
}
*/
```

### And

Updater does not support the and operator. Reducers created with And effectively become leaf nodes for Updater.