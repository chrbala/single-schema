// @flow

import { serialize } from 'examples/full-stack/shared/id';

import { database } from './schema';
export * as schema from './schema';

type IdType = number;
const serializeAllPeople = (people: Array<IdType>) => 
	people.map(id => serialize({
		table: 'person',
		id,
	})
);

const getInitialState = () => ({
	person: [
		{name: 'Bob'}, 
		{name: 'Susan'},
		{name: 'Larry'}, 
		{name: 'Curly'}, 
		{name: 'Moe'},
	],
	family: [{
		adults: serializeAllPeople([0, 1]),
		children: serializeAllPeople([2, 3, 4]),
	}],
});

export const create = () => {
	const { createUpdate } = database;

	let state = getInitialState();

	const getState = () => state;
	const subscribe = newState => state = newState;

	const update = createUpdate({getState, subscribe});
	return { getState, update };
};
