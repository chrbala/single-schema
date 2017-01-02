// @flow
/* eslint-disable flowtype/no-weak-types */

import test from 'ava';
import { graphql, printSchema } from 'graphql';

import schema from './graphqlSchema';
import * as Database from 'examples/full-stack/database';
import Loaders from './loaders';

test('Schema snapshot', t => {
	t.snapshot(printSchema(schema));
});

const Context = () => {
	const database = Database.create();
	return () => {
		const context = {};
		Object.assign(context, {
			database,
			// $FlowFixMe
			loaders: Loaders(context),
		});
		return context;
	};
};

const throwErrors = res => res.errors 
	? Promise.reject(res.errors)
	: res
;

const insert = (name, query) => (input, context) => 
	graphql(schema, query, {}, context, {input})
		.then(throwErrors)
		.then((res: any) => res.data[name])
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

const get = (queryName, {query, context, params}) =>
	graphql(schema, query, {}, context, params)
		.then(throwErrors)
		.then((res: any) =>
			res.data[queryName]
		);

const getNode = fragment => (id, context) => get('node', {
	query: `
		query($id:String!) {
			node(id:$id) {
		    id
		    ${fragment}
		  }
		}
	`, 
	context, 
	params: {id},
});

const personFragment = `{
	name
}`;

const getPerson = getNode(`
	...on person ${personFragment}
`);

const familyFragment = `{
	adults ${personFragment}
	children ${personFragment}
}`;

const getFamily = getNode(`
	...on family ${familyFragment}
`);

const getPersonAll = context => get('personAll', {
	query: `
		query {
			personAll ${personFragment}
		}
	`,
	context,
	params: {},
});

const getFamilyAll = context => get('familyAll', {
	query: `
		query {
			familyAll ${familyFragment}
		}
	`,
	context,
	params: {},
});

test('Person insertion and retrieval', async t => {
	const NAME = 'NAME';
	const context = Context();

	const insertionResult = await insertPerson({name: NAME}, context());

	t.is(insertionResult.name, NAME);

	const personNode = await getPerson(insertionResult.id, context());
	
	const actual = personNode;
	const expected = {
		id: insertionResult.id,
		name: NAME,
	};

	t.deepEqual(actual, expected);
});

test('Family insertion and retrieval', async t => {
	const NAMES = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
	const context = Context();

	const people = await Promise.all(
		NAMES.map(name => insertPerson({name}, context()))
	).then(res => res.map(({id}) => ({id})));

	const familyInput = {
		adults: people.slice(0, 2),
		children: people.slice(2, 4),
	};

	const { 
		id, 
		...familyInsertionResult 
	} = await insertFamily(familyInput, context());

	const expected = {
		adults: NAMES.slice(0, 2).map(name => ({name})),
		children: NAMES.slice(2, 4).map(name => ({name})),
	};

	t.deepEqual(familyInsertionResult, expected);

	const { 
		id: fetchedId, 
		...familyFetchResult 
	} = await getFamily(id, context());
	t.is(id, fetchedId);
	t.deepEqual(familyFetchResult, expected);
});

test('Bad person ID is rejected', async t => {
	t.plan(1);
	
	const context = Context();

	const familyInput = {
		adults: [{id: 'bogus'}],
		children: [],
	};

	await t.throws(insertFamily(familyInput, context()));

	console.log(await getFamilyAll(context));
});
