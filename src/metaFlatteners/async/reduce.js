// @flow

import type { AllReducerType } from '../../shared/types';
import type { FlattenerType } from '../../shared/types';

export default ({ reduce }: FlattenerType<*>) =>
  (children: AllReducerType) =>
    (context: *) =>
      (objInput?: {}, ...rest: Array<*>) =>
        new Promise(resolve => {
          const syncChildren = {};
          const promises = [];
          for (const childName in children) {
            const child = children[childName];
            if (child) {
              const childValue = objInput ? objInput[childName] : undefined;
              promises.push(
                Promise.resolve(child(childValue, ...rest)).then(
                  result => syncChildren[childName] = () => result,
                ),
              );
            } else
              syncChildren[childName] = undefined;
          }

          const done = () =>
            resolve(reduce(syncChildren)(context)(objInput, ...rest));
          return Promise.all(promises).then(done);
        });
