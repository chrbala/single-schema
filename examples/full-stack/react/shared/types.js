// @flow

export type UpdateType = (key: string | number) => 
	UpdateType & {set: (value: *) => void}
;
