// @flow

import Relay, { createContainer } from 'react-relay';
import Person from './person';

export default createContainer(Person, {
	fragments: {
		person: () => Relay.QL`
			fragment on person {
				id
				name
			}
		`,
	},
});
