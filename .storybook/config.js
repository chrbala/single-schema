// @flow

import { configure } from '@kadira/storybook';

const req = require.context('../examples', true, /.story.js$/);

function loadStories() {
	req.keys().forEach((filename: string) => req(filename));
}

configure(loadStories, module);
