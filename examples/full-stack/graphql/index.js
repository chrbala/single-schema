// @flow

import graphqlHTTP from 'express-graphql';
import express from 'express';

import schema from './graphqlSchema';
import * as Database from 'examples/full-stack/database';
import Loaders from './loaders';

const PORT = 4000;

const error = e => console.log(e);
const success = () => console.log(
	`GraphQL server running on http://localhost:${PORT}/graphql`
);

const database = Database.create();

express()
	.use('/graphql', graphqlHTTP({
		schema,
		pretty: true, 
		graphiql: true,
		context: {
			database,
			loaders: Loaders({database}),
		},
	}))

	.listen(PORT, err => err ? error(err) : success());
