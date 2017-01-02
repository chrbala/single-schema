// @flow

import 'babel-polyfill';
import { configure } from '@kadira/storybook';

import './injectNetwork';

const req = require.context('../examples', true, /.story.js$/);

function loadStories() {
	req.keys().forEach((filename: string) => req(filename));
}

configure(loadStories, module);
