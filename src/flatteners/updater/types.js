// @flow

export type ScopeType = {
  subscribe: (newState: *) => mixed,
  getState: () => {},
};
