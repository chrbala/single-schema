# Graphql

The Validator determines if the data provided is compliant with the schema. It will return null if there is no error. If there are errors, it will give an error object in the shape of the schema.

It's important to note that fields are **non-nullable** by default and must be made nullable by using maybe(). Types pulled from the store, however, are the base type.

This module is *stateful* in that calling .graphql() changes state - it doesn't simply return a value. This is part of the design so you can design your schema shape in a different file from your graphql options.

This API is a bit of a trial and is subject to change. I'm also interested in hearing use cases that would work well in the single-schema library.

## Setup
```javascript
import create from 'single-schema';
import GraphqlModule, { createStore } from 'single-schema/flatteners/graphql';

import * as graphql from 'graphql';

const store = createStore();
const flatteners = {
	graphql: GraphqlModule({store, graphql}),
};

const { combine, array, map, maybe } = create(flatteners);
```

## Leaves
Leaves are functions that return graphql types. Leaves are required to be defined as valid graphql types.

```javascript
import { GraphQLString } from 'graphql';

const string = {
	graphql: () => GraphQLString,
};
```

## Operators

### Combine

Adds a GraphQLObjectType or GraphQLInputObjectType to the store.

```javascript
const user = combine({
	username: string,
});

user.graphql('output', {
	name: 'Person',
	// Other graphql options go here.
	// Fields can be set, but the type is not directly settable here,
	// as it is defined in combine()
});
user.graphql('input', {
	name: 'PersonInput',
	// Other graphql input options go here.
	// Fields can be set, but the type is not directly settable here
	// as it is defined in combine()	
});

/*
returns the equivalent of: new GraphqlObjectType({
	name: 'Person',
	fields: {
		name: { type: new GraphQLNonNull(GraphQLString) },
	},
});
*/
store.get('Person');

/*
returns the equivalent of: new GraphqlInputObjectType({
	name: 'PersonInput',
	fields: {
		name: { type: new GraphQLNonNull(GraphQLString) },
	},
});
*/
store.get('PersonInput');
```

### Array

Coerces all of the elements of an array to its type.

```javascript
const user = combine({
	aliases: array(string),
});

user.graphql('output', {
	name: 'Person',
});
user.graphql('input', {
	name: 'PersonInput',
});

/*
returns the equivalent of: new GraphqlObjectType({
	name: 'Person',
	fields: {
		aliases: { type: new GraphQLNonNull(new GraphQLList(
			new GraphQLNonNull(GraphQLString)
		)) },
	},
});
*/
store.get('Person');

/*
returns the equivalent of: new GraphqlInputObjectType({
	name: 'PersonInput',
	fields: {
		aliases: { type: new GraphQLNonNull(new GraphQLList(
			new GraphQLNonNull(GraphQLString)
		)) },
	},
});
*/
store.get('PersonInput');
```

### Map

Map is not supported in Graphql.

### Maybe

Converts the type to a nullable type. 

```javascript
const user = combine({
	username: maybe(string),
});

user.graphql('output', {
	name: 'Person',
});
user.graphql('input', {
	name: 'PersonInput',
});

/*
returns the equivalent of: new GraphqlObjectType({
	name: 'Person',
	fields: {
		username: { type: GraphQLString },
	},
});
*/
store.get('Person');

/*
returns the equivalent of: new GraphqlInputObjectType({
	name: 'PersonInput',
	fields: {
		username: { type: GraphQLString },
	},
});
*/
store.get('PersonInput');
```

You can also create recursive data shapes with a thunk.

```javascript
const node = combine(() => ({
	value: string,
	next: maybe(node),
}));

node.graphql('output', {
	name: 'Node',
});
node.graphql('input', {
	name: 'NodeInput',
});

/*
returns the equivalent of: 
const node = new GraphqlObjectType({
	name: 'Node',
	fields: () => ({
		username: { type: node },
	}),
});
*/
store.get('Node');

/*
returns the equivalent of: 
const nodeInput = new GraphqlInputObjectType({
	name: 'PersonInput',
	fields: () => ({
		username: { type: nodeInput },
	}),
});
*/
store.get('PersonInput');
```

### And

And is not supported in Graphql.