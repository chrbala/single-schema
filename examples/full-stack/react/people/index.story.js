// @flow

import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Relay, { RootContainer } from 'react-relay';

import People from './';

const PeopleRoute = {
	name: 'PeopleRoute',
	queries: {
		viewer: () => Relay.QL`
			query {
				viewer
			}
		`,
	},
	params: {},
};

storiesOf('full-stack/people', module)
	.add('Basic', () => 
		<RootContainer
			Component={People}
			route={PeopleRoute}
		/>
	)
;
