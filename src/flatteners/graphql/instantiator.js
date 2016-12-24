// @flow

import { mapObj } from '../../util/micro';

type KindType = 'GraphQLObjectType' | 'GraphQLInputObjectType';
type ReturnType = {
	[key: KindType]: () => {},
};

type GetChildrenType = () => {
	[key: string]: ReturnType,
};
type ChildrenType = {
	graphql: GetChildrenType,
};
type StoreType = {
	set: (name: string, graphQLObject: {}) => mixed,
	get: (key: string) => () => {},
};
type ConfigType = {
	name: string,
	fields?: {},
	[key: string]: *,
};
type GraphqlAnyType = *;
type VariationType = {
	createName: (rawName: string) => string,
	build: (GraphqlConfig: ConfigType) => GraphqlAnyType,
};
type InitialConfigType = {
	store: StoreType,
	variations: Array<VariationType>,
};

export default ({store, variations}: InitialConfigType) => 
	({fields: configFields = {}, ...config}: ConfigType) => 
		({graphql: getChildren, ...remainingChildren}: ChildrenType) => {
			const allConfig = {
				...config,
				fields: () => mapObj(getChildren(), 
					(child, key) => {
						const childValue = child();
						return {
							...configFields[key],
							type: typeof childValue == 'string'
								? store.get(childValue)
								: childValue,
						};
					}
				),
			};

			variations.forEach(({createName, build}) => {
				const name = createName(config.name);
				store.set(name, () => build({...allConfig, name}));
			});

			return {
				...remainingChildren,
				graphql: config.name,
			};
		};
