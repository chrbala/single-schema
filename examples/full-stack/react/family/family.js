// @flow

import React from 'react';
import Relay, { GraphQLMutation } from 'react-relay';

import State from 'examples/full-stack/react/shared/state';
import { combine } from 'examples/setup';
import { boolean } from 'examples/schema';

import Edit from 'examples/full-stack/react/editFamily';
import { 
	family as familySchema,
	familyInput as familyInputSchema,
} from 'examples/full-stack/react/shared/schema';

const updateFamilyConfigs = node => [{
	type: 'FIELDS_CHANGE',
	fieldIDs: {
		node,
	},
}];

const updateFamilyQuery = Relay.QL`
	mutation($input:updateFamilyMutation!) {
		updateFamily(input:$input) {
			clientMutationId
			node {
				id
				adults {
					id
					name
				}
				children {
					id
					name
				}
			}
		}
	}
`;

const insertFamily = (input, configs) =>  
	GraphQLMutation.create(
		updateFamilyQuery, 
		{input}, 
		Relay.Store
	).commit(configs);

const PeopleView = ({people, type}) => 
	<div>
		<b>{type}</b>: {people.map(({name}) => name).join(', ')}
	</div>
;

const View = ({family, onEdit}) => 
	<div>
		<PeopleView people={family.adults} type='adults' />
		<PeopleView people={family.children} type='children' />
		<button onClick={onEdit}>edit</button>
	</div>
;

type PersonType = {
	id: string,
	name: string,
};
type PropsType = {
	viewer: {},
	family: {
		id: string,
		adults: Array<PersonType>,
		children: Array<PersonType>,
	},
	state: {
		editMode: boolean,
	},
	update: () => mixed & *,
	relay: {},
};
const Integration = ({viewer, family, state, update}: PropsType) =>
	state.editMode
		? <Edit 
				viewer={viewer}
				family={family} 
				onSave={_family => {
					update('editMode').set(false);
					const { coerce } = familyInputSchema;
					insertFamily(
						{family: coerce(_family)}, 
						updateFamilyConfigs(family.id)
					);
				}}
				onCancel={() => update('editMode').set(false)}
				mutateText='update'
			/>
		: <View 
				family={family} 
				onEdit={() => update('editMode').set(true)}
			/>
	;

Integration.propTypes = {
	family: familySchema.proptype({ignore: ['__dataID__']}),
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
