# Proptype

The Proptype determines if the data provided is compliant with the schema in the context of a React proptype. 

Proptype depends on a Validator module set to the ``validate`` key.

## Setup
```javascript
import create from 'single-schema';
import Validator from 'single-schema/flatteners/validate';
import Proptype from 'single-schema/flatteners/proptype';

const flatteners = {
	validate: Validator(),
	proptype: Proptype(),
};

const { combine, array, map, and, maybe } = create(flatteners);
```

```javascript
const string = {
	validate: value => typeof value == 'string'
	? null
	: 'Must be string',
};

const { proptype } = combineReducers({
	key: string,
});

const Component = () => <div />;
Component.propTypes = {
	test: proptype(),
};

// warns
<Component test={{key: 123}} />

// does not warn
<Component test={{key: 'hello'}} />
	
```