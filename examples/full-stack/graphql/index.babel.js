// @flow

import graphqlHTTP from 'express-graphql';
import express from 'express';

import schema from './graphqlSchema.babel';
import * as Database from 'examples/full-stack/database';
import Loaders from './loaders';

import type { ContextType } from 'examples/full-stack/shared/types';

const PORT = 4000;

const error = e => console.log(e);
const success = () => console.log(
	`GraphQL server running on http://localhost:${PORT}/graphql`
);

const database = Database.create();

express()
	.use((req: ContextType, res, next) => {
		Object.assign(req, {
			database,
			loaders: Loaders(req),
		});
		next();
	})
	.use('/graphql', graphqlHTTP({
		schema,
		pretty: true, 
		graphiql: true,
	}))

	.listen(PORT, err => err ? error(err) : success());
