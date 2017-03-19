// @flow

import { freeze } from '../../util/micro';

import type {
  AllReducerType,
  ReducerType,
  GenericObjectType,
} from '../../shared/types';

import { EXTRA_KEY_TEXT, EXPECTED_OBJECT } from './strings';

import Iterator from '../../util/iterator';
import { isObject } from '../../util/micro';
import { clean } from './shared';

export type OptionsType = {
  cache: boolean,
};
type LocalOptionsType = {
  ignore?: Array<string> | { [key: string]: boolean },
};
type ReduceType = (options: OptionsType) => ReducerType<*>;
const reduce: ReduceType = ({ cache }) =>
  (children: AllReducerType) =>
    () => {
      const iterate = Iterator({ cache });

      return (
        data: GenericObjectType,
        options: LocalOptionsType = {},
        context: *,
      ) => {
        let ignore = (options && options.ignore) || {};
        ignore = Array.isArray(ignore)
          ? ignore.reduce((acc, prop) => ((acc[prop] = true), acc), {})
          : ignore;
        if (!isObject(data)) return EXPECTED_OBJECT;

        const out = clean(
          iterate(
            children,
            data,
            (child, datum) => child ? child(datum, { ignore }, context) : null,
          ),
        );

        for (const key in data)
          if (!(key in children) && !ignore[key]) out[key] = EXTRA_KEY_TEXT;

        return Object.keys(out).length ? freeze(out) : null;
      };
    };

export default reduce;
