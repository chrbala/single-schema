// @flow

import React from 'react';
import Relay, { GraphQLMutation } from 'react-relay';

import State from 'examples/full-stack/react/shared/state';
import { combine } from 'examples/setup';
import { boolean } from 'examples/schema';

import Edit from 'examples/full-stack/react/editPerson';
import { 
	person as personSchema,
} from 'examples/full-stack/react/shared/schema';

const updatePersonConfigs = node => [{
	type: 'FIELDS_CHANGE',
	fieldIDs: {
		node,
	},
}];

const updatePersonQuery = Relay.QL`
	mutation($input:updatePersonMutation!) {
		updatePerson(input:$input) {
			clientMutationId
			node {
				id
				name
			}
		}
	}
`;

const insertPerson = (input, configs) =>  
	GraphQLMutation.create(
		updatePersonQuery, 
		{input}, 
		Relay.Store
	).commit(configs);

const View = ({person, onEdit}) => 
	<div>
		{person.name}
		<button onClick={onEdit}>edit</button>
	</div>
;

type PropsType = {
	person: {
		id: string,
		name: string,
	},
	state: {
		editMode: boolean,
	},
	update: () => mixed & *,
	relay: {},
};
const Integration = ({person, state, update}: PropsType) => state.editMode
	? <Edit 
			person={person} 
			onSave={_person => {
				update('editMode').set(false);
				insertPerson({person: _person}, updatePersonConfigs(person.id));
			}}
			onCancel={() => update('editMode').set(false)}
			mutateText='update'
		/>
	: <View 
			person={person} 
			onEdit={() => update('editMode').set(true)}
		/>
;
Integration.propTypes = {
	person: personSchema.proptype({ignore: ['__dataID__']}),
};

const integrationSchema = combine({
	editMode: boolean,
});

const StatefulIntegration = (props: *) => <State
	children={Integration}
	schema={integrationSchema}
	{...props}
/>;

export default StatefulIntegration;
