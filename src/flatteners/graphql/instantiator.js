// @flow

import { NAME, VALUE } from './types';
import type { 
	InputType, 
	OutputType, 
	ByValueType,
	StoreType,
	GetChildType,
	InitialConfigType,
	ConfigType,
} from './types';
import { normalizeInput } from './shared';
import { mapObj } from '../../util/micro';

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

export default ({store, variations, graphql}: InitialConfigType) => 
	(childNode: InputType) => 
		({fields: configFields = {}, ...config}: ConfigType) => {
			const normalized = normalizeInput(childNode);
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
