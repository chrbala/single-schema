// @flow

import { NAME, VALUE } from './types';
import type {
  InputType,
  OutputType,
  ByValueType,
  StoreType,
  InitialConfigType,
  ConfigType,
  VariationType,
} from './types';
import { normalizeInput, variationToStored } from './shared';
import { mapObj } from '../../util/micro';

const applyAll = ({ getValue, wrappers }) =>
  wrappers.reduce((acc, next) => next(acc), getValue());

type NormalizeChildType = (
  arg: {
    store: StoreType,
    child: OutputType,
    graphql: *,
    type: VariationType,
  },
) => ByValueType;
const normalizeChild: NormalizeChildType = (
  {
    store,
    child,
    graphql: { GraphQLNonNull },
    type,
  },
) => {
  let getValue;
  const { wrappers } = child;

  if (child.type === VALUE) getValue = child.getValue;
  else if (child.type === NAME) getValue = () => store.get(child.getName(type));

  return {
    type: VALUE,
    getValue: () => new GraphQLNonNull(getValue()),
    wrappers,
  };
};

const getType = arg => applyAll(normalizeChild(arg));

export default ({ store, graphql }: InitialConfigType) =>
  (childNode: InputType) => {
    const build = variation =>
      ({ fields: configFields = {}, ...config }: ConfigType) => {
        const normalized = normalizeInput(childNode);

        let classConstructor;
        if (variation === 'output')
          classConstructor = graphql.GraphQLObjectType;
        else if (variation === 'input')
          classConstructor = graphql.GraphQLInputObjectType;
        else if (variation === 'interface')
          classConstructor = graphql.GraphQLInterfaceType;
        else
          throw new Error(`Unsupported variation ${variation}`);

        const type = variationToStored(variation);
        normalized.register(config.name, type);

        const allConfig = {
          ...config,
          fields: () =>
            mapObj(normalized.getChildren(), (child, key) => {
              const normalizedChild = normalizeInput(child());
              const fields = typeof configFields === 'function'
                ? configFields()
                : configFields;

              return {
                ...fields[key],
                type: getType({
                  store,
                  child: normalizedChild,
                  graphql,
                  type,
                }),
              };
            }),
        };

        store.set(config.name, () => new classConstructor(allConfig));
      };

    return (type: VariationType, config: ConfigType) => build(type)(config);
  };
