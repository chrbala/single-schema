// @flow

import { freeze } from '../../util/micro';

import arrayOrMap from './arrayOrMap';

import type { ScopeType } from './types';

const insert = (scope: *) =>
  (key: string) => {
    const { subscribe, getState, context: { shape } } = scope;
    subscribe(freeze({ ...getState(), [key]: shape() }));
  };

type ChildType = (scope: ScopeType) => (...args: Array<*>) => void;
export default (child: ?ChildType) =>
  (context: { shape: () => mixed }) =>
    () =>
      ({ subscribe, getState }: ScopeType) =>
        // flow does not like Object.assign to be used like this
        // $FlowFixMe
        Object.assign(
          arrayOrMap('MAP')({
            subscribe,
            getState,
            child,
            context,
          }),
          {
            set: subscribe,
            insert: insert({ subscribe, getState, context }),
          },
        );
