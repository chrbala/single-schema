// @flow

import test from 'ava';
import { printSchema } from 'graphql';
import schema from './graphqlSchema';

test('Schema snapshot', t => {
	t.snapshot(printSchema(schema));
});
