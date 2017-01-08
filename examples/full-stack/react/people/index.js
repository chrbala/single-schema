// @flow

import Relay, { createContainer } from 'react-relay';

import People from './people';
import Person from 'examples/full-stack/react/person';

export default createContainer(People, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on viewer {
				personAll(first:100) {
					edges {
						node {
							id
							${Person.getFragment('person')}
						}
					}
				}
			}
		`,
	},
});
