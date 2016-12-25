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
	graphql: {[key: string]: *},
};

const applyAll = (functions, value) => functions.reduce(
	(acc, next) => next(acc)
, value);

const normalizeChild = (store, child) => typeof child.baseName == 'string'
	? store.get(child.baseName)
	: child.value
		? child.value
		: child
;

const getType = (store, child, {GraphQLNonNull}) => {
	const normalized = new GraphQLNonNull(normalizeChild(store, child));

	return child.wrappers
		? applyAll(child.wrappers, normalized)
		: normalized
	;
};

export default ({store, variations, graphql}: InitialConfigType) => 
	({fields: configFields = {}, ...config}: ConfigType) => 
		({graphql: getChildren, ...remainingChildren}: ChildrenType) => {
			const allConfig = {
				...config,
				fields: () => mapObj(getChildren(), 
					(child, key) => ({
						...configFields[key],
						type: getType(store, child(), graphql),
					})
				),
			};

			variations.forEach(({createName, build}) => {
				const name = createName(config.name);
				store.set(name, () => build({...allConfig, name}));
			});

			return {
				...remainingChildren,
				graphql: () => ({
					baseName: config.name,
					wrappers: [],
				}),
			};
		};
