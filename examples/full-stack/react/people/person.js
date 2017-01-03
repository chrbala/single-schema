// @flow

import React from 'react';

import State from '../shared/state';
import { combineReducers } from 'examples/setup';
import { boolean } from 'examples/schema';
import Relay, { createContainer } from 'react-relay';

import { 
	person as personSchema,
} from '../shared/schema';

const Edit = ({state, update, onSave, onCancel}) =>
	<div>
		<label>name</label>
		<input 
			value={state.name} 
			onChange={e => update('name').set(e.target.value)} 
		/>
		<button onClick={onCancel}>cancel</button>
		<button onClick={onSave}>save</button>
		<br />
	</div>
;

const StatefulEdit = props => <State
	children={Edit}
	schema={personSchema}
	initialState={props.person}
	{...props}
/>;

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
	? <StatefulEdit 
			person={person} 
			onSave={() => update('editMode').set(false)}
			onCancel={() => update('editMode').set(false)}
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
