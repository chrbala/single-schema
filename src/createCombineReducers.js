// @flow

import { mapObj } from './util/micro';

import type {
  AllReducerType,
  AllFlattenerType,
  ReducerType,
} from './shared/types';

const unThunk = maybeThunk =>
  typeof maybeThunk == 'function' ? maybeThunk() : maybeThunk;

type ReduceObjectType<T> = {
  [key: T]: ReducerType<T>,
};

type ArgType = AllFlattenerType<*>;
export default (flatteners: ArgType) => {
  const reducerFlatters: ReduceObjectType<*> = mapObj(
    flatteners,
    flattener => flattener.reduce,
  );

  return (children: {} | (() => {})) => {
    const out: AllReducerType = {};
    for (const name in reducerFlatters) {
      let cache;

      out[name] = (...args) => {
        if (!cache) {
          const reducers = mapObj(
            unThunk(children),
            child => child && child[name],
          );
          cache = reducerFlatters[name](reducers)(out);
        }

        return cache(...args);
      };
    }
    return out;
  };
};
