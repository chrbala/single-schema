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
	mutation($input:personMutation!) {
	  insertPerson(input:$input) {
	  	${fragment}
  	}
	}
`);

const insertFamily = insert('insertFamily', fragment => `
	mutation($input:familyMutation!) {
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

const getViewer = (queryName, ...args) => get('viewer', ...args)
	.then(res => res[queryName]);

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

const getPersonAll = (context, fragment) => getViewer('personAll', {
	query: `
		query {
			viewer {
				personAll {
					${fragment}
				}
			}
		}
	`,
	context,
	params: {},
});

const getFamilyAll = (context, fragment) => getViewer('familyAll', {
	query: `
		query {
			viewer {
				familyAll {
					${fragment}
				}
			}
		}
	`,
	context,
	params: {},
});

it('Person insertion and retrieval', async () => {
	const NAME = 'NAME';
	const MUTATION_ID = 'MUTATION_ID';
	const context = Context();

	const {
		clientMutationId,
		person: {
			id,
			name, 
		} } = await insertPerson(
		{ person: {name: NAME}, clientMutationId: MUTATION_ID}, context, `
			clientMutationId
			person {
				id
				name
			}
		`
	);
	expect(name).toBe(NAME);
	expect(clientMutationId).toBe(MUTATION_ID);

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
	const MUTATION_ID = 'MUTATION_ID';
	const context = Context();

	const people = await Promise.all(
		NAMES.map(name => insertPerson({person: {name}}, context, `
			person {
				id
			}
		`))
	).then(res => res.map(({person: {id}}) => ({id})));

	const familyInput = {
		clientMutationId: MUTATION_ID,
		family: {
			adults: people.slice(0, 2),
			children: people.slice(2, 4),
		},
	};

	const { 
		clientMutationId,
		family: {
			id, 
			...familyInsertionResult 
		},
	} = await insertFamily(familyInput, context, `
		clientMutationId
		family {
			id
			adults {
				name
			}
			children {
				name
			}
		}
	`);
	expect(id).toBeTruthy();
	expect(clientMutationId).toBe(MUTATION_ID);

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
		
	const {person: { id }} = await insertPerson({person: {name: NAME}}, context, `
		person {
			id
		}
	`);
	expect(id).toBeTruthy();

	const { edges } = await getPersonAll(context, `
		edges {
			node {
				id
				name
			}
		}
	`);
	const insertedPerson = edges
		.map(({node}) => node)
		.find(({id: _id}) => id == _id)
	;
	expect(insertedPerson.name).toBe(NAME);
});

it('familyAll works', async () => {
	const context = Context();
		
	const family = {
		adults: [],
		children: [],
	};
	const { family: { id } } = await insertFamily({family}, context, `
		family {
			id
			adults {
				name
			}
			children {
				name
			}
		}
	`);
	expect(id).toBeTruthy();

	const { edges } = await getFamilyAll(context, `
		edges {
			node {
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
	const insertedFamily = edges
		.map(({node}) => node)
		.find(({id: _id}) => id == _id)
	;
	expect(insertedFamily.adults).toEqual([]);
	expect(insertedFamily.children).toEqual([]);
});

it('Bad person ID is rejected before it is persisted', async () => {
	const context = Context();

	const family = {
		adults: [{id: 'bogus'}],
		children: [],
	};

	const fragment = `
		edges {
			node {
				id
			}
		}
	`;
	const before = (await getFamilyAll(context, fragment)).edges.length;

	try {
		await insertFamily({family}, context, `
			family {
				id
			}
		`);
	} catch (errors) {
		expect(errors[0].message).toMatch(/Invalid id/);
	}

	const after = (await getFamilyAll(context, fragment)).edges.length;
	expect(typeof before).toBe('number');
	expect(before).toBe(after);
});
