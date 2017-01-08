// @flow

import graphqlHTTP from 'express-graphql';
import express from 'express';

import schema from './graphqlSchema';
import localContext from './localContext';

const PORT = 4000;

const error = e => console.log(e);
const success = () => console.log(
	`GraphQL server running on http://localhost:${PORT}/graphql`
);

const ALLOW_ORIGINS = ['http://localhost:9011'];

// $FlowFixMe
express()
	// CORS support
	.use((req, res, next) => {
		const match = ALLOW_ORIGINS.find(origin => origin == req.headers.origin);

		if (match)
			res.set('Access-Control-Allow-Origin', req.headers.origin);
		next();
	})
	.options('*', (req, res) => {
		res.set('Allow', 'GET,HEAD,POST,OPTIONS');
		res.set('Access-Control-Allow-Headers', 'Content-Type');
		res.send();
	})

	.use('/graphql', graphqlHTTP({
		schema,
		pretty: true, 
		graphiql: true,
		context: localContext(),
	}))

	.listen(PORT, err => err ? error(err) : success());
