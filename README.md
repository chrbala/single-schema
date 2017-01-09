# Warning
It should be apparent from this file that this is a work in progress. Don't expect any part of the code to stay stable right now.

# Purpose
# Usage

# Taxonomy
* Reducers act on other reducers and will be flattened into a single value, often acting on data
* Operators act on 1 or more reducers, returning a single reducer
* Flatteners govern how operators act on reducers

# TODO
* Write operators: or, exact/permissive
* Better cross-flattener use (?)
* Actual docs
* Metadata annotations (name, description, etc)
* Arbitrary data path comparisons for validation
  * key1 OR key2 must exist
  * key1 AND key2 must exist
  * key1 XOR key2 must exist
* Figure out if there is a good way to share input/output graphql schemas
* Add another function in reducers to allow state that exists before children are registered
* Async support

# Candidates for cross-flattener use
* use validate to determine which reducer to pick with an OR operator
