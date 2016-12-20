// @flow

import React, { Component } from 'react';
import { family } from './data';

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

const People = ({kind, value, update}) =>
	<div>
		{value.map((person, i) => 
			<Person key={i} value={value[i]} update={update.get(i)} />
		)}
		<button onClick={() => update.push()}>Add {kind}</button>
	</div>
;

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
