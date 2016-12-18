// @flow

import type { AnyFnType } from '../../shared/types';
import type { ScopeType } from './types';

import reduce from './reduce';

type ChildType = (scope: ScopeType) => (...args: Array<*>) => void;
type ContextType = {shape: () => mixed};
export default (child: ?ChildType) => (context: ContextType) =>
	({subscribe, getState}: ScopeType) => 
		(...args: Array<*>) => {
			const newDataProvided = !!args.length;
			if (!newDataProvided)
				return {subscribe, getState, child, context};

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
			child,
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
		const out: {} & () => mixed = child
			? child(childScope)
			: reduce({}, {})(childScope)
		;
		return out;
	}
;

type OptionType = {mutates?: boolean, useShape?: boolean};
const arrayOp = (operation: AnyFnType, {mutates, useShape}: OptionType = {}) => 
	(getScope: () => *) => 
		(...args: Array<*>) => {
			const {subscribe, getState, context: { shape }} = getScope();

			const selectedArgs = args.length || !useShape || !shape
				? args
				: [shape()]
			;

			const safeState = normalizeArray(getState(), mutates);
			const out = operation.apply(safeState, selectedArgs);
			subscribe(safeState);
			return out;
		}
	;
;

export const length = arrayOp(function() {
	return this.length;
});

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
