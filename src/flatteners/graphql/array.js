// @flow

import wrap from './wrap';

export default wrap(({GraphQLList, GraphQLNonNull}) => data => 
	new GraphQLNonNull(new GraphQLList(data)))
;
