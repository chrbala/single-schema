// @flow

import { action } from '@kadira/storybook';
import injectNetwork from 'mocks/injectNetwork';

injectNetwork({
	onError: action('error'),
	integration: !!process.env.STORYBOOK_INTEGRATION,
});
