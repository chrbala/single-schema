# Async

Async applies to the Validator to make it work asynchronously. It was designed to work with Coercer as well, but has not been tested with it. 

¯\_(ツ)_/¯

## Setup
```javascript
import create from 'single-schema';
import Validator from 'single-schema/flatteners/validate';
import Async from 'single-schema/metaFlatteners/async';

const flatteners = {
	validate: Async(Validator()),
};

const { combine, array, map, and, maybe } = create(flatteners);
```

## Leaves
The leaves work in the same way as the Validator (Coercer), but they can be async. Note that invalid leaves are still resolved - do not reject invalid results.

```javascript
const stringAsync = {
	validate: value => new Promise(resolve => 
		setTimeout(() => resolve(typeof value == 'string'
			? null
			: 'Expected string!'
		), 10)
	),
};
```

## Operators

Operators all work like they would with Validator (Coercer), but the leaves can be async.

```javascript
/* returns: Promise<{
	key2: IS_STRING_ERROR,
}>
*/
validate({
	key1: 'hello',
	key2: 123,
});
```