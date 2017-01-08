// @flow

import React from 'react';
import Relay, { GraphQLMutation } from 'react-relay';

import Person from 'examples/full-stack/react/person';
import State from 'examples/full-stack/react/shared/state';
import { combine } from 'examples/setup';
import { boolean } from 'examples/schema';
import EditPerson from 'examples/full-stack/react/editPerson';
import { 
	person as personSchema,
} from '../shared/schema';

const insertPersonQuery = Relay.QL`
	mutation($input:insertPersonMutation!) {
		insertPerson(input:$input) {
			clientMutationId
			edge {
				node {
					id
					name
				}
			}
		}
	}
`;

const insertPersonConfigs = parentID => [{
	type: 'RANGE_ADD',
	parentName: 'viewer',
	parentID,
	connectionName: 'personAll',
	edgeName: 'edge',
	rangeBehaviors: {
		'': 'append',
	},
}];

const insertPerson = (input, configs) =>  
	GraphQLMutation.create(
		insertPersonQuery, 
		{input}, 
		Relay.Store
	).commit(configs);

const People = ({viewer, state, update}) => 
	<div>
		{viewer.personAll.edges.map(({node}) => 
			<Person 
				key={node.id} 
				person={node} 
			/>
		)}

		{state.insertMode 
			? <EditPerson
					onCancel={() => update('insertMode').set(false)}
					onSave={person => {
						update('insertMode').set(false);
						insertPerson({person}, insertPersonConfigs(viewer.__dataID__));
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

const peopleState = combine({
	insertMode: boolean,
});

export default (props: PropsType) => <State
	children={People}
	schema={peopleState}
	{...props}
/>;
