// @flow

import type { AllReducerType } from '../../shared/types';

export default (graphql: *) => 
	(graphqlOptions: {}) => 
		(reducers: AllReducerType) => new graphql.GraphQLObjectType({

		})
	;
;
