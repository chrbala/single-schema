// @flow

import create from 'src/';

import Coercer from 'src/flatteners/coercer';
import Shaper from 'src/flatteners/shaper';
import Updater from 'src/flatteners/updater';
import Validator from 'src/flatteners/validator';
import PropType from 'src/flatteners/proptype';

import * as graphql from 'graphql';
import GraphqlFlattener, { createStore } from 'src/flatteners/graphql';

import Async from 'src/metaFlatteners/async';

export const store = createStore();

const flatteners = {
	validate: Validator({cache: true}),
	validateAsync: Async(Validator()),
	coerce: Coercer({cache: true}),
	coerceAsync: Async(Coercer()),
	shape: Shaper(),
	createUpdate: Updater(),
	proptype: PropType(),
	graphql: GraphqlFlattener({
		graphql,
		store,
	}),
};

const { combine, array, map, and, maybe } = create(flatteners);

export {
	combine,
	array, 
	map, 
	and, 
	maybe,
};
