// @flow

import type { FlattenerType } from '../../shared/types';

export default ({ maybe }: FlattenerType<*>) =>
  (child: *) =>
    (context: *) =>
      (flatteners: *) =>
        (data?: [] = [], ...rest: Array<*>) =>
          Promise.resolve(maybe(child)(context)(flatteners)(data, ...rest));
