// @flow

import React from 'react';

import State from 'examples/full-stack/react/shared/state';
import { combine } from 'examples/setup';
import { boolean } from 'examples/schema';

import Edit from 'examples/full-stack/react/editPerson';
import { 
	person as personSchema,
} from 'examples/full-stack/react/shared/schema';

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
