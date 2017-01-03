// @flow

import React from 'react';
import Relay, { RelayGraphQLMutation } from 'react-relay';

import Person from './person';
import getEnvironment from '../shared/environment';
import State from '../shared/state';
import { combineReducers } from 'examples/setup';
import { boolean } from 'examples/schema';

const People = ({viewer, state, update}) => 
	<div>
		{viewer.personAll.map(person => 
			<Person 
				key={person.id} 
				person={person} 
			/>
		)}

		{state.insertMode 
			? <div>insert!</div>
			: <button onClick={() => update('insertMode').set(true)}>
					add person
				</button>
		}
	</div>
;

type PropsType = { 
	viewer: {
		personAll: Array<*>,
	},
};

const peopleState = combineReducers({
	insertMode: boolean,
});

export default (props: PropsType) => <State
	children={People}
	schema={peopleState}
	{...props}
/>;
