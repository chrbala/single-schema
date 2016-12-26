// @flow

import { NAME, VALUE } from './types';
import type { InputType, OutputType, ByValueType } from './types';
import { normalizeInput } from './shared';
import { mapObj } from '../../util/micro';

type ChildrenType = {
	graphql: () => InputType,
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

type GetChildType = (name: string) => string;

type GraphqlAnyType = *;
type VariationType = {
	createName: (rawName: string) => string,
	build: (GraphqlConfig: ConfigType) => GraphqlAnyType,
	getChildName: GetChildType,
};
type InitialConfigType = {
	store: StoreType,
	variations: Array<VariationType>,
	graphql: {[key: string]: *},
};

const applyAll = ({getValue, wrappers}) => wrappers.reduce(
	(acc, next) => next(acc)
, getValue());

type NormalizeChildType = (arg: {
	store: StoreType, 
	child: OutputType, 
	graphql: *, 
	getChildName: GetChildType,
}) => ByValueType;
const normalizeChild: NormalizeChildType = ({
	store, 
	child, 
	graphql: {GraphQLNonNull}, 
	getChildName,
}) => {
	let getValue;

	if (child.type === VALUE)
		getValue = child.getValue;
	else if (child.type === NAME)
		getValue = () => store.get(getChildName(child.getName()));

	return {
		type: VALUE,
		getValue: () => new GraphQLNonNull(getValue()),
		wrappers: child.wrappers,
	};
};

const getType = (store, child, graphql) => 
	applyAll(normalizeChild(store, child, graphql));
;

export default ({store, variations, graphql}: InitialConfigType) => 
	({fields: configFields = {}, ...config}: ConfigType) => 
		({graphql: childNode}: ChildrenType) => {
			const normalized = normalizeInput(childNode());
			normalized.register(config.name);

			variations.forEach(({createName, build, getChildName}) => {
				const allConfig = {
					...config,
					fields: () => mapObj(normalized.getChildren(),
						(child, key) => ({
							...configFields[key],
							type: getType({
								store, 
								child: normalizeInput(child()), 
								graphql, 
								getChildName,
							}),
						})
					),
				};

				const name = createName(config.name);
				store.set(name, () => build({...allConfig, name}));
			});
		};
