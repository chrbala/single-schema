// @flow

import Coercer from './flatteners/coercer';
import Shaper from './flatteners/shaper';
import Updater from './flatteners/updater';
import Validator from './flatteners/validator';
import PropType from './flatteners/proptype';

import * as graphql from 'graphql';
import { 
	GraphQLObjectType, 
	GraphQLInputObjectType,
} from 'graphql';
import GraphqlFlattener from './flatteners/graphql';
import createStore from './flatteners/graphql/createStore';

const makeInputType = name => `${name}Input`;

/* eslint-disable flowtype/no-weak-types */
const variations = [{
	createName: rawName => rawName,
	build: (config: any) => new GraphQLObjectType(config),
	getChildName: name => name,
}, {
	createName: makeInputType,
	build: (config: any) => new GraphQLInputObjectType(config),
	getChildName: makeInputType,
}];
/* eslint-enable flowtype/no-weak-types */

export const store = createStore();

export default {
	validate: Validator({cache: true}),
	coerce: Coercer({cache: true}),
	shape: Shaper({leafNode: undefined}),
	createUpdate: Updater(),
	proptype: PropType(),
	graphql: GraphqlFlattener({
		graphql,
		store,
		variations,
	}),
};
