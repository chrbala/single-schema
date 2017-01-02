// @flow

import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import State from '../shared/state';
import { person } from '../shared/schema';
import Person from './person';

storiesOf('full-stack/person', module)
	.add('Basic', () => 
		<State 
			onChange={action('update')} 
			children={Person} 
			schema={person} 
			initialState={{
				name: 'Bob',
			}}
			onSave={action('save')}
		/>
	)
;
