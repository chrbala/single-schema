// @flow

import React from 'react';
import { person } from 'examples/full-stack/react/shared/schema';
import type { UpdateType } from 'examples/full-stack/react/shared/types';

type PersonType = {
	name: string,
};
type PropsType = {
	value: PersonType,
	update: UpdateType,
	onSave: (data: PersonType) => mixed,
};
const Person = ({value, update, onSave}: PropsType) =>
	<div>
		<label>name</label>
		<input 
			value={value.name} 
			onChange={e => update('name').set(e.target.value)} 
		/>
		<button onClick={() => onSave(value)}>Save</button>
		<br />
	</div>
;

Person.propTypes = {
	value: person.proptype(),
};

export default Person;
