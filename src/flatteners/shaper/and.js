// @flow

type OptionsType = {
	leafNode: *,
};

export default ({leafNode}: OptionsType) => 
	(shaper: () => mixed) => () =>
		shaper ? shaper() : leafNode
;
