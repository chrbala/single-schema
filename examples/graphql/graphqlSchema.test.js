// @flow
/* eslint-disable flowtype/no-weak-types */

import test from 'ava';
import { graphql, printSchema } from 'graphql';
import schema from './graphqlSchema';

import * as database from '../database';

test('Schema snapshot', t => {
	t.snapshot(printSchema(schema));
});

const throwErrors = res => res.errors ? Promise.reject(res.errors) : res;

const insert = (name, query) => (input, context) => 
	graphql(schema, query, {}, context, {input})
		.then(throwErrors)
		.then((res: any) => 
			res.data[name]
		)
	;

const insertPerson = insert('insertPerson', `
	mutation($input:personInput!) {
	  insertPerson(input:$input) {
	    id
	    name
	  }
	}
`);

const insertFamily = insert('insertFamily', `
	mutation($input:familyInput!) {
	  insertFamily(input:$input) {
	  	id
	    adults {
	      name
	    }
	    children {
	      name
	    }
	  }
	}
`);

const getNode = fragment => (id, context) => {
	const query = `
		query($id:String!) {
			node(id:$id) {
		    id
		    ${fragment}
		  }
		}
	`;

	return graphql(schema, query, {}, context, {id})
		.then(throwErrors)
		.then((res: any) =>
			res.data.node
		);
};

const getPerson = getNode(`
	...on person {
  	name
  }
`);

const getFamily = getNode(`
	...on family {
  	adults {
  		name
  	}
  	children {
  		name
  	}
  }
`);

test('Person insertion and retrieval', async t => {
	const NAME = 'NAME';

	const context = {
		database: database.create(),
	};

	const insertionResult = await insertPerson({name: NAME}, context);

	t.is(insertionResult.name, NAME);

	const personNode = await getPerson(insertionResult.id, context);
	
	const actual = personNode;
	const expected = {
		id: insertionResult.id,
		name: NAME,
	};

	t.deepEqual(actual, expected);
});

test('Family insertion and retrieval', async t => {
	const NAMES = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
	const context = {
		database: database.create(),
	};

	const people = await Promise.all(
		NAMES.map(name => insertPerson({name}, context))
	).then(res => res.map(({id}) => ({id})));

	const familyInput = {
		adults: people.slice(0, 2),
		children: people.slice(2, 4),
	};

	const { 
		id, 
		...familyInsertionResult 
	} = await insertFamily(familyInput, context);

	const expected = {
		adults: NAMES.slice(0, 2).map(name => ({name})),
		children: NAMES.slice(2, 4).map(name => ({name})),
	};

	t.deepEqual(familyInsertionResult, expected);

	const { id: fetchedId, ...familyFetchResult } = await getFamily(id, context);
	t.is(id, fetchedId);
	t.deepEqual(familyFetchResult, expected);
});
