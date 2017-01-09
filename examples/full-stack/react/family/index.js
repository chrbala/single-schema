// @flow

import Relay, { createContainer } from 'react-relay';
import Family from './family';

export default createContainer(Family, {
	fragments: {
		family: () => Relay.QL`
			fragment on family {
				id
				adults {
					id
					name
				}
				children {
					id
					name
				}
			}
		`,
	},
});
