// @flow

import { GraphQLObjectType } from 'graphql';
import * as graphql from 'graphql';
import Instantiator from '../../src/flatteners/graphql/Instantiator';
import createStore from '../../src/flatteners/graphql/createStore';

export const store = createStore();

export const instantiate = Instantiator({
	store,
	variations: [{
		createName: rawName => rawName,
		/* eslint-disable flowtype/no-weak-types */
		build: (config: any) => new GraphQLObjectType(config),
		/* eslint-enable flowtype/no-weak-types */
	}],
	graphql,
});
