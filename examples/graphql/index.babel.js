// @flow

import graphqlHTTP from 'express-graphql';
import express from 'express';

import schema from './graphqlSchema';
import * as database from '../database';

import type { ContextType } from '../shared/types';

const PORT = 4000;

const error = e => console.log(e);
const success = () => console.log(
	`GraphQL server running on http://localhost:${PORT}/graphql`
);

express()
	.use((req: ContextType, res, next) => {
		req.database = database.create();
		next();
	})
	.use('/graphql', graphqlHTTP({
		schema,
		pretty: true, 
		graphiql: true,
	}))

	.listen(PORT, err => err ? error(err) : success());
