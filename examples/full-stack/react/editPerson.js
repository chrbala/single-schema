// @flow

import React from 'react';

import State from 'examples/full-stack/react/shared/state';
import { 
	person as personSchema,
} from 'examples/full-stack/react/shared/schema';

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
const StatefulEdit = (props: PropsType) => <State
	children={Edit}
	schema={personSchema}
	initialState={props.person}
	{...props}
/>;

StatefulEdit.propTypes = {
	person: personSchema.proptype({ignore: ['__dataID__']}),
};

export default StatefulEdit;
