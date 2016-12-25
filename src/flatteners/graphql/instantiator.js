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

const applyAll = ({value, wrappers}) => wrappers.reduce(
	(acc, next) => next(acc)
, value);

const normalizeChild = (store, child, {GraphQLScalarType, GraphQLNonNull}) => {
	let value;
	let wrappers;

	if (child instanceof GraphQLScalarType) {
		value = child;
		wrappers = [];
	} else if (child.value instanceof GraphQLScalarType) {
		value = child.value;
		wrappers = child.wrappers;
	} else if (typeof child.baseName == 'string') {
		value = store.get(child.baseName);
		wrappers = child.wrappers;
	} else {
		console.log(child.key());
		throw new Error('NOPE');
	}

	return {
		value: new GraphQLNonNull(value),
		wrappers,
	};
};

const getType = (store, child, graphql) => 
	applyAll(normalizeChild(store, child, graphql))
;

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
