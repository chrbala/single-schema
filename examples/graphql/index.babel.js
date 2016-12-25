// @flow

import graphqlHTTP from 'express-graphql';
import express from 'express';

import schema from './schema';

const PORT = '8888';

const error = e => console.log(e);
const success = () => console.log(
	`GraphQL server running on http://localhost:${PORT}/graphql`
);

express()
	.use('/graphql', graphqlHTTP({
		schema,
		pretty: true, 
		graphiql: true,
	}))

	.listen(PORT, err => err ? error(err) : success());
