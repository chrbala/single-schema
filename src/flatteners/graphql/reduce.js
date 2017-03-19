// @flow

import { NAME } from './types';
import type {
  ByNameType,
  InitialConfigType,
  VariationType,
  StoredTypesType,
} from './types';
import { variationToStored } from './shared';
import type { AllReducerType } from '../../shared/types';
import Instantiator from './instantiator';

export default (config: InitialConfigType) =>
  (children: AllReducerType) =>
    (context: *) => {
      const names: { [key: StoredTypesType]: ?string } = {
        input: undefined,
        output: undefined,
      };

      const getName = (variation: VariationType) => {
        const type = variationToStored(variation);
        if (!names[type]) throw new Error(`${type} type has not been set`);
        return names[type];
      };
      const register = (name: string, variation: VariationType) => {
        const type = variationToStored(variation);
        if (names[type])
          throw new Error(`Can not set ${type} type multiple times on ${name}`);

        names[type] = name;
      };
      const getChildren = () => children;

      const out: ByNameType = {
        type: NAME,
        getName,
        register,
        getChildren,
        wrappers: [],
      };

      return (...args: Array<*>) => {
        if (!args.length) return out;

        const [type, graphqlConfig] = args;
        Instantiator(config)(out)(type, graphqlConfig);
        return context;
      };
    };
