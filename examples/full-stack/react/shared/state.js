// @flow

import React, { Component } from 'react';

import type { UpdateType } from './types';

type InferType = *;
type OnChangeType = (value: *) => void;
type SchemaType = {
	[key: string]: () => InferType,
};

type ComponentType = InferType;
type PropsType = {
	onChange: OnChangeType,
	schema: SchemaType,
	children: ComponentType,
	initialState?: *,
};

const without = (...props) => obj => {
	const out = {};
	for (const key in obj)
		if (!props.find(prop => prop == key))
			out[key] = obj[key];
	return out;
};

export default class State extends Component {
	props: PropsType;
	state: {
		childState: {
			[key: string]: *,
		};
	};
	update: UpdateType;

	constructor(props: PropsType) {
		super(props);
		const { 
			onChange, 
			schema: { shape, createUpdate },
			initialState = shape(),
		} = this.props;

		this.state = {
			childState: initialState,
		};

		this.update = createUpdate({
			getState: () => this.state.childState,
			subscribe: childState => this.setState(
				{childState}, 
				() => onChange(childState)
			),
		});
	}

	render() {
		const { 
			children: Child, 
			...rest
		} = without('onChange', 'schema', 'initialState')(this.props);
		const { childState } = this.state;
		const { update } = this;

		return <div>
			<Child update={update} value={childState} {...rest} />
		</div>;
	}
};
