// @flow

type ReturnType = {
	baseName?: string,
	value?: {},
	wrappers: Array<() => mixed>,
};

type InputType = ReturnType | {};

const normalizeInput: (input: InputType | {}) => ReturnType = input => {
	// just trying to make flow happy here
	if (Array.isArray(input.wrappers))
		return {...input};

	return {
		value: input,
		wrappers: [],
	};
};

export default ({graphql: {GraphQLList}}: *) => 
	(input: ?() => InputType) => 
		() => () => {
			if (!input)
				throw new Error('Graphql child is required.');

			const { wrappers, ...rest } = normalizeInput(input());
			return () => ({
				...rest,
				wrappers: [...wrappers, (data: {}) => new GraphQLList(data)],
			});
		};
