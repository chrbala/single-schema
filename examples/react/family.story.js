// @flow

import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Family from './family';

storiesOf('react/family', module)
	.add('Basic', () => <Family onChange={action('update')} />)
;
