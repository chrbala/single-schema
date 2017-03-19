// @flow

import { freeze, isFrozen } from '../../util/micro';
import reduce from './reduce';
import Flattener from './';

export const normalizeArray = (value: *, mutates: boolean) =>
  Array.isArray(value) ? mutates || !isFrozen(value) ? [...value] : value : [];

const normalizeObject = (value: *, mutates: boolean) =>
  value ? mutates || !isFrozen(value) ? { ...value } : value : {};

type AllowedType = 'ARRAY' | 'MAP';
const isArray = (kind: AllowedType) => kind == 'ARRAY';

const normalize = (value: *, mutates: boolean, kind) =>
  isArray(kind)
    ? normalizeArray(value, mutates)
    : normalizeObject(value, mutates);

export default (kind: AllowedType) =>
  (scope: *) =>
    (key: number | string) => {
      const {
        subscribe: scopedSubscribe,
        getState: scopedGetstate,
        child,
      } = scope;

      const getState = () => {
        const state = normalize(scopedGetstate(), false, kind);
        // This is expected. At worst this will return undefined.
        // $FlowFixMe
        return state[key];
      };
      const subscribe = (data, path = [], value = data) => {
        const safeState = normalize(scopedGetstate(), true, kind);
        // This is expected. Type checking happens here at runtime.
        // $FlowFixMe
        safeState[key] = data;
        scopedSubscribe(freeze(safeState), [key, ...path], value);
      };

      const childScope = { getState, subscribe };
      return child ? child(childScope) : reduce({})(Flattener())(childScope);
    };
