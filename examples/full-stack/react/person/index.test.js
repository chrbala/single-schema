// @flow

import React from 'react';
import Relay, { RootContainer, GraphQLMutation } from 'react-relay';
import { mount } from 'enzyme';

import Person from './';
import 'mocks/';

const insertPersonQuery = Relay.QL`
	mutation($input:insertPersonMutation!) {
	  insertPerson(input:$input) {
	  	clientMutationId
		  edge {
		  	node {
		  		${Person.getFragment('person')}
	  		}
  		}
  	}
	}
`;

const insertPerson = input => new Promise((resolve, reject) => 
	new GraphQLMutation(insertPersonQuery, {input}, null, Relay.Store, {
		onSuccess: data => resolve(data.insertPerson),
		onFailure: transaction => reject(transaction.getError()),
	}).commit()
);

const PersonRoute = id => ({
	name: 'PersonRoute',
	queries: {
		person: () => Relay.QL`
			query($id:String!) {
				node(id:$id)
			}
		`,
	},
	params: {
		id,
	},
});

it('does not warn or error when rendered', async () => {
	// $FlowFixMe
	console.warn = jest.genMockFunction();
	// $FlowFixMe
	console.error = jest.genMockFunction();

	const person = {name: 'asdf'};
	const { edge } = await insertPerson({person});
	const id = edge.node.id;

	await new Promise((resolve, reject) => mount(<RootContainer
		Component={Person}
		route={PersonRoute(id)}
		renderFetched={data => {
			process.nextTick(resolve);
			return <Person {...data} />;
		}}
		renderFailure={reject}
	/>));

	expect(console.warn).not.toBeCalled();
	expect(console.error).not.toBeCalled();
});
