// @flow

import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Relay, { RootContainer } from 'react-relay';

import Families from './';

const FamilyRoute = {
	name: 'FamilyRoute',
	queries: {
		viewer: () => Relay.QL`
			query {
				viewer
			}
		`,
	},
	params: {},
};

storiesOf('full-stack/families', module)
	.add('Basic', () => 
		<RootContainer
			Component={Families}
			route={FamilyRoute}
		/>
	)
;
