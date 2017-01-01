// @flow

require('babel-polyfill');
require('babel-core/register');

Object.assign(exports, require('./graphqlSchema.babel'));
