// @flow

import { freeze } from '../../util/micro';
import { normalizeArray } from './arrayOrMap';

import type { AnyFnType } from '../../shared/types';

type OptionType = {mutates: boolean, useShape?: boolean};
const arrayOp = (operation: AnyFnType, {mutates, useShape}: OptionType = {}) => 
	(scope: *) => 
		(...args: Array<*>) => {
			const { subscribe, getState, context: { shape } } = scope;

			const selectedArgs = args.length || !useShape || !shape
				? args
				: [shape()]
			;

			const safeState = normalizeArray(getState(), mutates);
			const out = operation.apply(safeState, selectedArgs);
			subscribe(freeze(safeState));
			return out;
		}
	;
;

export const copyWithin = arrayOp(Array.prototype.copyWithin, {mutates: true});
export const fill = arrayOp(Array.prototype.fill, {mutates: true});
export const pop = arrayOp(Array.prototype.pop, {mutates: true});
export const push = arrayOp(Array.prototype.push, {
	mutates: true, 
	useShape: true,
});
export const reverse = arrayOp(Array.prototype.reverse, {mutates: true});
export const shift = arrayOp(Array.prototype.shift, {mutates: true});
export const sort = arrayOp(Array.prototype.sort, {mutates: true});
export const splice = arrayOp(Array.prototype.splice, {mutates: true});
export const unshift = arrayOp(Array.prototype.unshift, {
	mutates: true,
	useShape: true,
});
