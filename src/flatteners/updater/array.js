// @flow

import { mapObj } from '../../util/micro';

import arrayOrMap from './arrayOrMap';
import * as arrayOps from './arrayOps';

import type { ScopeType } from './types';

type ChildType = (scope: ScopeType) => (...args: Array<*>) => void;
export default (child: ?ChildType) =>
  (context: {}) =>
    () =>
      ({ subscribe, getState }: ScopeType) =>
        // flow does not like Object.assign to be used like this
        // $FlowFixMe
        Object.assign(
          arrayOrMap('ARRAY')({
            subscribe,
            getState,
            child,
            context,
          }),
          {
            set: subscribe,
          },
          mapObj(arrayOps, op =>
            op({
              subscribe,
              getState,
              child,
              context,
            })),
        );
