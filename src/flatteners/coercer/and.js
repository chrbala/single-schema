// @flow

export default (...coercers: Array<?(data: *) => mixed>) =>
  () =>
    () =>
      (data: *) =>
        coercers
          .filter(coercer => coercer)
          .reduce((acc, coercer) => coercer(acc), data);
