// @flow

import React from 'react';

import State from 'examples/full-stack/react/shared/state';
import { 
	family as familySchema,
} from 'examples/full-stack/react/shared/schema';
import SelectPerson from 'examples/full-stack/react/selectPerson';

const EditPerson = ({state, viewer, update}) => 
	<div>
		<SelectPerson viewer={viewer} state={state} update={update} />
	</div>
;

const EditPeople = ({type, viewer, state, update}) =>
	<div>
		<b>{type}: </b>
		{state.map((person, i) => 
			<EditPerson key={i} viewer={viewer} state={state[i]} update={update(i)} />
		)}
	</div>
;

const Edit = ({viewer, state, update, onSave, onCancel, mutateText}) => 
	<div>
		<EditPeople 
			type='Adults' 
			viewer={viewer}
			state={state.adults} 
			update={update('adults')} 
		/>
		<EditPeople 
			type='Children'
			viewer={viewer} 
			state={state.children} 
			update={update('children')} 
		/>
		<button onClick={onCancel}>cancel</button>
		<button onClick={() => onSave(state)}>{mutateText}</button>
		<br />
	</div>
;

type PointerType = {
	id: string,
	[key: string]: *,
};
type PropsType = {
	viewer: {},
	family: {
		adults: Array<PointerType>,
		children: Array<PointerType>,
	},
	onSave: () => mixed,
	onCancel: () => mixed,
	mutateText: string,
};
const StatefulEdit = (props: PropsType) => <State
	children={Edit}
	schema={familySchema}
	initialState={props.family}
	{...props}
/>;

StatefulEdit.propTypes = {
	family: familySchema.proptype({ignore: ['__dataID__']}),
};

export default StatefulEdit;
