// @flow

import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Family from './family';

storiesOf('Family', module)
	.add('Basic', () => <Family onChange={action('update')} />)
;
