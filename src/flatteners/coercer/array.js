// @flow

import { freeze } from '../../util/micro';

export default (coerce: ?(data: *) => mixed) =>
  () =>
    () =>
      (data: *) => {
        if (!coerce) return data;

        if (!data) return freeze([]);

        return freeze(Array.prototype.map.call(data, coerce));
      };
