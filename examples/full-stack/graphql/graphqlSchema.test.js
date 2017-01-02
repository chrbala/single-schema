// @flow
/* eslint-disable flowtype/no-weak-types */

import { graphql, printSchema } from 'graphql';

import schema from './graphqlSchema';
import * as Database from 'examples/full-stack/database';
import Loaders from './loaders';

it('Schema snapshot', () => {
	expect(printSchema(schema)).toMatchSnapshot();
});

const Context = () => {
	const database = Database.create();
	return Object.freeze({
		database,
		loaders: Loaders({database}),
	});
};

const throwErrors = res => res.errors 
	? Promise.reject(res.errors)
	: res
;

const insert = (name, query) => (input, context, fragment) => 
	graphql(schema, query(fragment), {}, context, {input})
		.then(throwErrors)
		.then((res: any) => res.data[name])
	;

const insertPerson = insert('insertPerson', fragment => `
	mutation($input:personInput!) {
	  insertPerson(input:$input) {
	  	${fragment}
	  }
	}
`);

const insertFamily = insert('insertFamily', fragment => `
	mutation($input:familyInput!) {
	  insertFamily(input:$input) {
	  	${fragment}
  	}
	}
`);

const get = (queryName, {query, context, params}) =>
	graphql(schema, query, {}, context, params)
		.then(throwErrors)
		.then((res: any) => 
			res.data[queryName]
		);

const getNode = (id, context, fragment) => get('node', {
	query: `
		query($id:String!) {
			node(id:$id) {
				${fragment}
			}
		}
	`, 
	context, 
	params: {id},
});

const getPersonAll = (context, fragment) => get('personAll', {
	query: `
		query {
			personAll {
				${fragment}
			}
		}
	`,
	context,
	params: {},
});

const getFamilyAll = (context, fragment) => get('familyAll', {
	query: `
		query {
			familyAll {
				${fragment}
			}
		}
	`,
	context,
	params: {},
});

it('Person insertion and retrieval', async () => {
	const NAME = 'NAME';
	const context = Context();

	const { name, id } = await insertPerson({name: NAME}, context, `
		... on person {
			id
			name
		}
	`);
	expect(name).toBe(NAME);

	const personNode = await getNode(id, context, `
		... on person {
			id
			name
		}
	`);
	
	const actual = personNode;
	const expected = {
		id,
		name: NAME,
	};

	expect(actual).toEqual(expected);
});

it('Family insertion and retrieval', async () => {
	const NAMES = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
	const context = Context();

	const people = await Promise.all(
		NAMES.map(name => insertPerson({name}, context, `...on person {
			id
		}`))
	).then(res => res.map(({id}) => ({id})));

	const familyInput = {
		adults: people.slice(0, 2),
		children: people.slice(2, 4),
	};

	const { 
		id, 
		...familyInsertionResult 
	} = await insertFamily(familyInput, context, `...on family {
		id
		adults {
			name
		}
		children {
			name
		}
	}`);
	expect(id).toBeTruthy();

	const expected = {
		adults: NAMES.slice(0, 2).map(name => ({name})),
		children: NAMES.slice(2, 4).map(name => ({name})),
	};

	expect(familyInsertionResult).toEqual(expected);

	const { 
		id: fetchedId, 
		...familyFetchResult 
	} = await getNode(id, context, `...on family {
		id
		adults {
			name
		}
		children {
			name
		}
	}`);
	expect(id).toBe(fetchedId);
	expect(familyFetchResult).toEqual(expected);
});

it('personAll works', async () => {
	const NAME = 'asdf';
	const context = Context();
		
	const { id } = await insertPerson({name: NAME}, context, `
		id
	`);
	expect(id).toBeTruthy();

	const allPeople = await getPersonAll(context, `
		id
		name
	`);
	const insertedPerson = allPeople.find(({id: _id}) => id == _id);
	expect(insertedPerson.name).toBe(NAME);
});

it('familyAll works', async () => {
	const context = Context();
		
	const family = {
		adults: [],
		children: [],
	};
	const { id } = await insertFamily(family, context, `
		id
		adults {
			name
		}
		children {
			name
		}
	`);
	expect(id).toBeTruthy();

	const allFamilies = await getFamilyAll(context, `
		id
		adults {
			name
		}
		children {
			name
		}
	`);
	const insertedFamily = allFamilies.find(({id: _id}) => id == _id);
	expect(insertedFamily.adults).toEqual([]);
	expect(insertedFamily.children).toEqual([]);
});

it('Bad person ID is rejected before it is persisted', async () => {
	const context = Context();

	const familyInput = {
		adults: [{id: 'bogus'}],
		children: [],
	};

	const fragment = `
		id
	`;
	const before = (await getFamilyAll(context, fragment)).length;

	try {
		await insertFamily(familyInput, context, `
			id
		`);
	} catch (e) {}

	const after = (await getFamilyAll(context, fragment)).length;
	expect(typeof before).toBe('number');
	expect(before).toBe(after);
});
