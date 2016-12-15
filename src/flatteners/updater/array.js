// @flow

import type { ReducerType, AnyFnType } from '../../shared/types';
import type { ScopeType } from './types';

import reduce from './reduce';

export default (children: ReducerType<*>) => 
	({subscribe, getState}: ScopeType) => 
		(...args: Array<*>) => {
			const newDataProvided = !!args.length;
			if (!newDataProvided)
				return {subscribe, getState, children};

			const newValue = args[0];
			subscribe(newValue);
		}
	;

const normalizeArray = (value, mutates) =>
	Array.isArray(value) 
		? mutates 
			? [...value] 
			: value
		: []
	;

export const get = (getScope: () => *) => 
	(index: number) => {
		const {
			subscribe: scopedSubscribe, 
			getState: scopedGetstate, 
			children,
		} = getScope();
		
		const getState = () => {
			const state = normalizeArray(scopedGetstate(), false);
			return state[index];
		};
		const subscribe = data => {
			const safeState = normalizeArray(scopedGetstate(), false);
			safeState[index] = data;
			scopedSubscribe(safeState);
		};
		
		const childScope = {getState, subscribe};
		const out: {} & () => mixed = children
			? children(childScope)
			: reduce({})(childScope)
		;
		return out;
	}
;

const arrayOp = (operation: AnyFnType, mutates: boolean) => 
	(getScope: () => ScopeType) => 
		(...args: Array<*>) => {
			const {subscribe, getState} = getScope();
			const safeState = normalizeArray(getState(), mutates);
			const out = operation.apply(safeState, args);
			subscribe(safeState);
			return out;
		}
	;
;

export const length = arrayOp(function() {
	return this.length;
}, false);

export const copyWithin = arrayOp(Array.prototype.copyWithin, true);
export const fill = arrayOp(Array.prototype.fill, true);
export const pop = arrayOp(Array.prototype.pop, true);
export const push = arrayOp(Array.prototype.push, true);
export const reverse = arrayOp(Array.prototype.reverse, true);
export const shift = arrayOp(Array.prototype.shift, true);
export const sort = arrayOp(Array.prototype.sort, true);
export const splice = arrayOp(Array.prototype.splice, true);
export const unshift = arrayOp(Array.prototype.unshift, true);
