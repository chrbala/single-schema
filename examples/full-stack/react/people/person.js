// @flow

import React from 'react';

import State from '../shared/state';
import { combineReducers } from 'examples/setup';
import { boolean } from 'examples/schema';
import Relay, { createContainer } from 'react-relay';
import Edit from './editPerson';

const View = ({person, onEdit}) => 
	<div>
		{person.name}
		<button onClick={onEdit}>edit</button>
	</div>
;

type PropsType = {
	person: {
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
			onSave={() => update('editMode').set(false)}
			onCancel={() => update('editMode').set(false)}
			mutateText='update'
		/>
	: <View 
			person={person} 
			onEdit={() => update('editMode').set(true)}
		/>
;

const integrationSchema = combineReducers({
	editMode: boolean,
});

const StatefulIntegration = props => <State
	children={Integration}
	schema={integrationSchema}
	{...props}
/>;

export default createContainer(StatefulIntegration, {
	fragments: {
		person: () => Relay.QL`
			fragment on person {
				id
				name
			}
		`,
	},
});
