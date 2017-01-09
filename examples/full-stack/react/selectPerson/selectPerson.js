// @flow

import React from 'react';

type PersonType = {
	id: string,
	name: string,
};
type PropsType = { 
	update: *,
	state: {id: string},
	viewer: {
		personAll: {
			edges: Array<{node: PersonType}>,
		},
	},
	initialState: string,
};

export default ({state: {id}, viewer, update}: PropsType) =>
	<div>
		<select value={id} onChange={({target}) => update('id').set(target.value)} >
			<option value='' disabled />
			{viewer.personAll.edges.map(({node}) => node).map(person =>
				<option key={person.id} value={person.id}>{person.name}</option>
			)}
		</select>
	</div>
;
