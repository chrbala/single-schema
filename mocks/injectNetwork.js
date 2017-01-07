// @flow

import Relay from 'react-relay';
import RelayLocalSchema from 'relay-local-schema';
import schema from 'examples/full-stack/graphql/graphqlSchema';
import localContext from 'examples/full-stack/graphql/localContext';

type OptionsType = {
	onError?: (error: mixed) => mixed,
};
export default ({onError = () => null}: OptionsType = {}) => 
	Relay.injectNetworkLayer(
		new RelayLocalSchema.NetworkLayer({
			schema,
			onError,
			contextValue: localContext(),
		})
	);
