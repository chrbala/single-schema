// @flow

export default () => {
  let count = 0;
  const execute = () => count++;
  execute.timesRun = () => count;
  return execute;
};
