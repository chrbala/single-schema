// @flow

import React from 'react';
import Relay, { GraphQLMutation } from 'react-relay';

import Person from './person';
import State from '../shared/state';
import { combineReducers } from 'examples/setup';
import { boolean } from 'examples/schema';
import EditPerson from './editPerson';
import { 
	person as personSchema,
} from '../shared/schema';

const insertPersonQuery = Relay.QL`
	mutation($input:personMutation!) {
	  insertPerson(input:$input) {
	  	clientMutationId
			person {
				id
				name
			}
  	}
	}
`;

const insertPerson = input => 
	GraphQLMutation.create(insertPersonQuery, {input}, Relay.Store).commit();

const People = ({viewer, state, update}) => 
	<div>
		{viewer.personAll.map(person => 
			<Person 
				key={person.id} 
				person={person} 
			/>
		)}

		{state.insertMode 
			? <EditPerson
					onCancel={() => update('insertMode').set(false)}
					onSave={person => {
						update('insertMode').set(false);
						insertPerson({person});
					}}
					person={personSchema.shape()}
					mutateText='save'
				/>
			: <button onClick={() => update('insertMode').set(true)}>
					add person
				</button>
		}
	</div>
;

type PropsType = { 
	viewer: {
		personAll: Array<*>,
	},
};

const peopleState = combineReducers({
	insertMode: boolean,
});

export default (props: PropsType) => <State
	children={People}
	schema={peopleState}
	{...props}
/>;
