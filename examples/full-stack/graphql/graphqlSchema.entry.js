// @flow

require('babel-polyfill');
require('babel-core/register');
require('../../createAbsolutePath');

Object.assign(exports, require('./graphqlSchema'));
