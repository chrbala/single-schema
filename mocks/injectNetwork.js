// @flow

import Relay from 'react-relay';
import RelayLocalSchema from 'relay-local-schema';
import schema from 'examples/full-stack/graphql/graphqlSchema';
import localContext from 'examples/full-stack/graphql/localContext';

type OptionsType = {
	onError?: (error: mixed) => mixed,
	integration: boolean,
};
export default 
	({onError = () => null, integration = false}: OptionsType = {}) => 
		integration 
			? Relay.injectNetworkLayer(
			  new Relay.DefaultNetworkLayer('http://localhost:4000/graphql')
			) : Relay.injectNetworkLayer(
				new RelayLocalSchema.NetworkLayer({
					schema,
					onError,
					contextValue: localContext(),
				})
			)
		;	
