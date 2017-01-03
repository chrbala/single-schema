// @flow

import { action } from '@kadira/storybook';

import Relay from 'react-relay';
import RelayLocalSchema from 'relay-local-schema';
import schema from 'examples/full-stack/graphql/graphqlSchema';
import localContext from 'examples/full-stack/graphql/localContext';

Relay.injectNetworkLayer(
	new RelayLocalSchema.NetworkLayer({
		schema,
		onError: action('error'),
		contextValue: localContext(),
	})
);
