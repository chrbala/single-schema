// @flow

import * as graphqlLib from 'graphql';
import { GraphQLString } from 'graphql';

import createCombineReducers from '../../createCombineReducers';
import { createArray } from '../../operators';
import GraphQLFlattener from './';
import createStore from './createStore';

const getValue = value => JSON.parse(JSON.stringify(value));

const string = {
  graphql: () => GraphQLString,
};

it('Base test', () => {
  const NAME = 'ArrayExample';

  const store = createStore();
  const flatteners = {
    graphql: GraphQLFlattener({
      graphql: graphqlLib,
      store,
    }),
  };
  const combineReducers = createCombineReducers(flatteners);
  const array = createArray(flatteners);

  combineReducers({
    key: array(string),
  }).graphql('output', {
    name: NAME,
  });

  const grahpqlObject = store.get(NAME);

  const actual = getValue(grahpqlObject.getFields());
  const expected = {
    key: {
      type: '[String!]!',
      isDeprecated: false,
      name: 'key',
      args: [],
    },
  };
  expect(actual).toEqual(expected);
});
