// @flow

import createCombineReducers from 'src/createCombineReducers';
import { createArray, createAnd, createMaybe, createMap } from 'src/operators';

import Coercer from 'src/flatteners/coercer';
import Shaper from 'src/flatteners/shaper';
import Updater from 'src/flatteners/updater';
import Validator from 'src/flatteners/validator';
import PropType from 'src/flatteners/proptype';

import * as graphql from 'graphql';
import GraphqlFlattener from 'src/flatteners/graphql';
import createStore from 'src/flatteners/graphql/createStore';

export const store = createStore();

const flatteners = {
	validate: Validator({cache: true}),
	coerce: Coercer({cache: true}),
	shape: Shaper({leafNode: undefined}),
	createUpdate: Updater(),
	proptype: PropType(),
	graphql: GraphqlFlattener({
		graphql,
		store,
	}),
	graphqlInput: GraphqlFlattener({
		graphql,
		store,
	}),
};

export const combineReducers = createCombineReducers(flatteners);
export const array = createArray(flatteners);
export const map = createMap(flatteners);
export const and = createAnd(flatteners);
export const maybe = createMaybe(flatteners);
