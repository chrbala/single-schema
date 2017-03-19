// @flow

import Spy from './helpers/spy';

import createCombineReducers from './createCombineReducers';

it('createCombineReducers returns fn that creates the proper keys', () => {
  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: () => () => () => null,
    },
  });

  const reducers = combineReducers({});

  const actual = Object.keys(reducers);
  const expected = ['doSomething'];

  expect(actual).toEqual(expected);
});

it('Reducer is passed in all the data', () => {
  expect.assertions(1);

  const inputData = {
    key: 'hi',
  };

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: () => () => data => expect(data).toEqual(inputData),
    },
  });

  const { doSomething } = combineReducers({});
  doSomething(inputData);
});

it('Only the relevant reducer is run', () => {
  const spy1 = Spy();
  const spy2 = Spy();

  const inputData = {
    key: 'hi',
  };

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: () => () => spy1,
    },
    doSomethingElse: {
      reduce: () => () => spy2,
    },
  });

  expect(spy1.timesRun()).toBe(0);
  expect(spy2.timesRun()).toBe(0);

  const { doSomething } = combineReducers({});
  doSomething(inputData);

  expect(spy1.timesRun()).toBe(1);
  expect(spy2.timesRun()).toBe(0);
});

it('Reducer is provided with its children when run', () => {
  expect.assertions(1);

  const child = () => () => null;

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: ({ key }) => () => () => expect(key).toBe(child),
    },
  });

  const { doSomething } = combineReducers({
    key: {
      doSomething: child,
    },
  });
  doSomething();
});

it('defaultFlattener assigns a function child to a flattener', () => {
  expect.assertions(1);

  const child = () => () => null;

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: ({ key }) => () => () => expect(key).toBe(child),
    },
  });

  const { doSomething } = combineReducers({
    key: {
      doSomething: child,
    },
  });
  doSomething();
});

it('Reducer is still run when child is missing a matching reducer', () => {
  expect.assertions(1);

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: ({ key }) => () => () => expect(key).toBe(undefined),
    },
  });

  const { doSomething } = combineReducers({
    key: {},
  });
  doSomething();
});

it('Reducer is still run when child is null', () => {
  expect.assertions(1);

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: ({ key }) => () => () => expect(key).toBe(null),
    },
  });

  const { doSomething } = combineReducers({
    key: null,
  });
  doSomething();
});

it('Reducer can have state', () => {
  let i = 0;

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: ({ key }) => {
        i++;
        return () => () => expect(key).toBe(null);
      },
    },
  });

  const { doSomething } = combineReducers({
    key: null,
  });

  doSomething();
  doSomething();

  expect(i).toBe(1);
});

type InferredType = *;
it('Reducer is provided the context of other reducers', () => {
  expect.assertions(2);

  const combineReducers = createCombineReducers({
    doSomething: {
      reduce: () =>
        (context: { doSomethingElse: () => InferredType }) =>
          () => {
            expect(Object.keys(context)).toEqual([
              'doSomething',
              'doSomethingElse',
            ]);
            expect(context.doSomethingElse()).toBe(5);
          },
    },
    doSomethingElse: {
      reduce: () => () => () => 5,
    },
  });

  const { doSomething } = combineReducers({});
  doSomething();
});
