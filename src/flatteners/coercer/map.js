// @flow

import { freeze, mapObj } from '../../util/micro';

export default (coerce: ?(data: *) => mixed) =>
  () =>
    () =>
      (data: *) => {
        if (!coerce) return data;

        if (!data) return freeze({});

        return freeze(mapObj(data, coerce));
      };
