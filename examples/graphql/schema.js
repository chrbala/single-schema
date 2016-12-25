// @flow

import { GraphQLSchema } from 'graphql';

import { combineReducers } from '../../src';
import { person, family } from '../data';
import { store, instantiate } from './setup';

instantiate({
	name: 'Person',
})(person);

instantiate({
	name: 'Family',
})(family);

// const query = combineReducers({
// 	family,
// });
// instantiate({
// 	name: 'query',
// })(query);

const f = store.get('Family').getFields();
console.log(f);

// console.log(store.get('Family').getFields());

// export default new GraphQLSchema({
// 	query: store.get('query'),
// });
