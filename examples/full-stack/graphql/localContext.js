// @flow

import * as Database from 'examples/full-stack/database';
import Loaders from './loaders';

const database = Database.create();

export default () => ({
	database,
	loaders: Loaders({database}),
});
