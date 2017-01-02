// @flow

import React, { Component } from 'react';
import { 
	family, 
	people, 
	person,
} from 'examples/full-stack/react/shared/schema';

const Person = ({value, update}) =>
	<div>
		<label>name</label>
		<input 
			value={value.name} 
			onChange={e => update('name').set(e.target.value)} 
		/>
		<br />
	</div>
;

Person.propTypes = {
	value: person.proptype(),
};

const People = ({kind, value, update}) =>
	<div>
		{value.map((_, i) => 
			<Person key={i} value={value[i]} update={update(i)} />
		)}
		<button onClick={() => update.push()}>Add {kind}</button>
	</div>
;

People.propTypes = {
	value: people.proptype(),
};

export default class Family extends Component {
	state = {
		familyState: family.shape(),
	};

	update = family.createUpdate({
		getState: () => this.state.familyState,
		subscribe: familyState => this.setState(
			{familyState}, 
			() => this.props.onChange(familyState)
		),
	});

	render() {
		const { familyState } = this.state;
		const { update } = this;

		return <div>
			<People 
				kind="adults" 
				value={familyState.adults} 
				update={update('adults')} 
			/>
			<br />
			<People 
				kind="children" 
				value={familyState.children} 
				update={update('children')} 
			/>
		</div>;
	}
}
