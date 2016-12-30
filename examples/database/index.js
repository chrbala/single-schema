// @flow

import { serialize } from '../shared/id';

import { database } from './schema';
export * as schema from './schema';

type IdType = number;
const serializeAllPeople = (people: Array<IdType>) => 
	people.map(id => serialize({
		table: 'person',
		id,
	})
);

let state = {
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
};

const { createUpdate } = database;

export const getState = () => state;
const subscribe = newState => state = newState;

export const update = createUpdate({getState, subscribe});
