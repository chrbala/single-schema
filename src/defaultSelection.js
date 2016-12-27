// @flow

import Coercer from './flatteners/coercer';
import Shaper from './flatteners/shaper';
import Updater from './flatteners/updater';
import Validator from './flatteners/validator';
import PropType from './flatteners/proptype';

import * as graphql from 'graphql';
import { GraphQLObjectType } from 'graphql';
import GraphqlFlattener from './flatteners/graphql';
import createStore from './flatteners/graphql/createStore';
const variations = [{
	createName: rawName => rawName,
	/* eslint-disable flowtype/no-weak-types */
	build: (config: any) => new GraphQLObjectType(config),
	/* eslint-enable flowtype/no-weak-types */
	getChildName: name => name,
}];

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
