// @flow

import { createPropType } from './shared';

import type { ReducerType } from '../../shared/types';

const reduce: ReducerType<*> = () =>
  ({ validate }) => (options: {}) => createPropType(validate, options);

export default reduce;
