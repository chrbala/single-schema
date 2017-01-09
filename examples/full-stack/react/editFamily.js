// @flow

import React from 'react';

import State from 'examples/full-stack/react/shared/state';
import { 
	family as familySchema,
	familyInput as familyInputSchema,
} from 'examples/full-stack/react/shared/schema';
import SelectPerson from 'examples/full-stack/react/selectPerson';

const EditPeople = ({type, viewer, state, update}) =>
	<div>
		<b>{type}: </b>
		{state.map((person, i) => 
			<SelectPerson 
				key={i} 
				viewer={viewer} 
				state={state[i]} 
				update={update(i)} 
			/>
		)}
		<button onClick={() => update.push()}>Add {type}</button>
	</div>
;

const { coerce, validate } = familyInputSchema;

const Edit = ({viewer, state, update, onSave, onCancel, mutateText}) => 
	<div>
		<EditPeople 
			type='adults' 
			viewer={viewer}
			state={state.adults} 
			update={update('adults')} 
		/>
		<EditPeople 
			type='children'
			viewer={viewer} 
			state={state.children} 
			update={update('children')} 
		/>
		<button onClick={onCancel}>cancel</button>
		<button onClick={() => onSave(state)} disabled={!!validate(coerce(state))}>
			{mutateText}
		</button>
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
