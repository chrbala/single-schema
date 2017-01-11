# Warning
It should be apparent from this file that this is a work in progress. Don't expect any part of the code to stay stable right now.

# Purpose
# Usage

# Taxonomy
* Reducers act on other reducers and will be flattened into a single value, often acting on data
* Operators act on 1 or more reducers, returning a single reducer
* Flatteners govern how operators act on reducers

# TODO
* Actual docs
* Async state support
  * Add another function in reducers to allow state that exists before children are registered

# Possible features
* Write operators: or, subset
* Arbitrary data path comparisons for validation
  * key1 OR key2 must exist
  * key1 AND key2 must exist
  * key1 XOR key2 must exist
* Better caching on validator/coercer