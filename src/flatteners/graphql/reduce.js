// @flow

import type { AllReducerType } from '../../shared/types';

export default (children: AllReducerType) => () => children;
