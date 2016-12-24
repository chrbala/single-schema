// @flow

import { mapObj } from '../../util/micro';

type KindType = 'GraphQLObjectType' | 'GraphQLInputObjectType';
type ReturnType = {
	[key: KindType]: () => {},
};

type GetChildrenType = () => {
	[key: string]: ReturnType,
};
type MapType = {
	[key: string]: *,
};
type ChildrenType = {
	graphql: GetChildrenType,
};
export default ({graphql}: MapType) => 
	({fields: configFields = {}, ...config}: MapType) => 
		({graphql: getChildren, ...remainingChildren}: ChildrenType) => {
			const create = (kind: KindType) => () => new graphql[kind]({
				...config,
				fields: mapObj(getChildren(), 
					(child, key) => {
						const childValue = child();
						return {
							...configFields[key],
							type: childValue[kind] || childValue,
						};
					}
				),
			});

			return {
				...remainingChildren,
				GraphQLObjectType: create('GraphQLObjectType'),
				GraphQLInputObjectType: create('GraphQLInputObjectType'),
			};
		};
