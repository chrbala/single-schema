// @flow

import { normalizeInput } from './shared';
import type { InputType } from './types';

type WrapperType = (graphql: *) => (value: *) => mixed;

export default (wrapper: WrapperType) => ({graphql}: *) => 
	(input: () => InputType) => 
		() => () => {
			const { wrappers, ...rest } = normalizeInput(input());
			return () => ({
				...rest,
				wrappers: [...wrappers, wrapper(graphql)],
			});
		};
