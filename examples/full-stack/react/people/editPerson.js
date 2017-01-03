// @flow

import React from 'react';

import State from '../shared/state';
import { 
	person as personSchema,
} from '../shared/schema';

const Edit = ({state, update, onSave, onCancel, mutateText}) =>
	<div>
		<label>name</label>
		<input 
			value={state.name} 
			onChange={e => update('name').set(e.target.value)} 
		/>
		<button onClick={onCancel}>cancel</button>
		<button onClick={() => onSave(state)}>{mutateText}</button>
		<br />
	</div>
;

type PropsType = {
	person: {
		name: string,
	},
	onSave: () => mixed,
	onCancel: () => mixed,
	mutateText: string,
};
export default (props: PropsType) => <State
	children={Edit}
	schema={personSchema}
	initialState={props.person}
	{...props}
/>;
