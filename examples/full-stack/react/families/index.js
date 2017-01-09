// @flow

import Relay, { createContainer } from 'react-relay';

import Families from './families';
import Family from 'examples/full-stack/react/family';
import SelectPerson from 'examples/full-stack/react/selectPerson';

export default createContainer(Families, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on viewer {
				${SelectPerson.getFragment('viewer')}
				familyAll(first:100) {
					edges {
						node {
							id
							${Family.getFragment('family')}
						}
					}
				}
			}
		`,
	},
});
