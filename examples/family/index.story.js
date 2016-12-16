// @flow

import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Family from './';

storiesOf('Family', module)
	.add('Basic', () => <Family onChange={action('update')} />)
;
