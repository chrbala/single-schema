// @flow

export default (...validators: Array<?(data: *) => mixed>) =>
  () =>
    () =>
      (data: *, options: *, context: *) =>
        validators
          .filter(validator => validator)
          .reduce(
            (acc, validator) =>
              acc || (validator ? validator(data, options, context) : null),
            null,
          );
