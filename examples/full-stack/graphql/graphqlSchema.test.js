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
	mutation($input:insertPersonMutation!) {
	  insertPerson(input:$input) {
	  	${fragment}
  	}
	}
`);

const updatePerson = insert('updatePerson', fragment => `
	mutation($input:updatePersonMutation!) {
	  updatePerson(input:$input) {
	  	${fragment}
  	}
	}
`);

const insertFamily = insert('insertFamily', fragment => `
	mutation($input:insertFamilyMutation!) {
	  insertFamily(input:$input) {
	  	${fragment}
  	}
	}
`);

const updateFamily = insert('updateFamily', fragment => `
	mutation($input:updateFamilyMutation!) {
	  updateFamily(input:$input) {
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
		edge: {
			node: {
				id,
				name,
			},
		} } = await insertPerson(
		{ person: {name: NAME}, clientMutationId: MUTATION_ID}, context, `
			clientMutationId
			edge {
				node {
					id
					name
				}
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

it('Person mutation', async () => {
	const NAME_1 = 'NAME';
	const NAME_2 = 'NAME_2';
	const MUTATION_ID = 'MUTATION_ID';
	const context = Context();

	const {
		edge: {
			node: {
				id,
			},
		},
	} = await insertPerson(
		{person: {name: NAME_1}, clientMutationId: MUTATION_ID}, 
		context, `
			edge {
				node {
					id
					name
				}
			}
		`
	);

	const updated = {
		id,
		name: NAME_2,
	};

	const {
		clientMutationId,
		node: {
			id: updatedId,
			name: updatedName,
		},
	} = await updatePerson(
		{person: updated, clientMutationId: MUTATION_ID}, 
		context, `
			clientMutationId
			node {
				id
				name
			}
		`
	);

	expect(clientMutationId).toBe(MUTATION_ID);
	expect(updatedName).toBe(NAME_2);
	expect(updatedId).toBe(id);

	const personNode = await getNode(id, context, `
		... on person {
			id
			name
		}
	`);
	
	const actual = personNode;
	const expected = {
		id,
		name: NAME_2,
	};

	expect(actual).toEqual(expected);
});

it('Family insertion and retrieval', async () => {
	const NAMES = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
	const MUTATION_ID = 'MUTATION_ID';
	const context = Context();

	const people = await Promise.all(
		NAMES.map(name => insertPerson({person: {name}}, context, `
			edge {
				node {
					id
				}
			}
		`))
	).then(res => res.map(({edge}) => ({id: edge.node.id})));

	const familyInput = {
		clientMutationId: MUTATION_ID,
		family: {
			adults: people.slice(0, 2),
			children: people.slice(2, 4),
		},
	};

	const { 
		clientMutationId,
		edge: {
			node: {
				id, 
				...familyInsertionResult 
			},
		},
	} = await insertFamily(familyInput, context, `
		clientMutationId
		edge {
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

it('Family mutation', async () => {
	const MUTATION_ID = 'MUTATION_ID';
	const context = Context();

	const familyInsertInput = {
		family: {
			adults: [],
			children: [],
		},
	};

	const id = (await insertFamily(familyInsertInput, context, `
		edge {
			node {
				id
			}
		}
	`)).edge.node.id;
	
	const personId = (await insertPerson({person: {name: 'asdf'}}, context, `
		edge {
			node {
				id
			}
		}
	`)).edge.node.id;

	const familyUpdateInput = {
		clientMutationId: MUTATION_ID,
		family: {
			id,
			adults: [{id: personId}],
			children: [],
		},
	};

	const updateResult = await updateFamily(familyUpdateInput, context, `
		clientMutationId
		node {
			id
			adults {
				id
			}
			children {
				id
			}
		}
	`);

	expect(updateResult).toEqual({
		clientMutationId: familyUpdateInput.clientMutationId,
		node: familyUpdateInput.family,
	});

	const persistedResult = await getNode(id, context, `...on family {
		id
		adults {
			id
		}
		children {
			id
		}
	}`);
	expect(persistedResult).toEqual(familyUpdateInput.family);
});

it('personAll works', async () => {
	const NAME = 'asdf';
	const context = Context();
		
	const { edge } = await insertPerson({person: {name: NAME}}, context, `
		edge {
			node {
				id
			}
		}
	`);

	const id = edge.node.id;
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
	const { edge } = await insertFamily({family}, context, `
		edge {
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

	const id = edge.node.id;
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
			edge {
				node {
					id
				}
			}
		`);
	} catch (errors) {
		expect(errors[0].message).toMatch(/Invalid id/);
	}

	const after = (await getFamilyAll(context, fragment)).edges.length;
	expect(typeof before).toBe('number');
	expect(before).toBe(after);
});
