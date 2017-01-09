// @flow

import Relay, { createContainer } from 'react-relay';

import SelectPerson from './selectPerson';

export default createContainer(SelectPerson, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on viewer {
				personAll(first:100) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		`,
	},
});
