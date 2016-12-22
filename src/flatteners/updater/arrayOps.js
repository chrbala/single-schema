// @flow

import { freeze, isFrozen } from '../../util/micro';
import reduce from './reduce';

import type { AnyFnType } from '../../shared/types';

const normalizeArray = (value: *, mutates: boolean) =>
	Array.isArray(value) 
		? mutates || !isFrozen(value)
			? [...value] 
			: value
		: []
	;

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

export default (scope: *) => 
	(index: number) => {
		const {
			subscribe: scopedSubscribe, 
			getState: scopedGetstate, 
			child,
		} = scope;

		const getState = () => {
			const state = normalizeArray(scopedGetstate(), false);
			return state[index];
		};
		const subscribe = data => {
			const safeState = normalizeArray(scopedGetstate(), true);
			safeState[index] = data;
			scopedSubscribe(freeze(safeState));
		};
		
		const childScope = {getState, subscribe};
		return child
			? child(childScope)
			: reduce({}, {})(childScope)
		;
	}
;
