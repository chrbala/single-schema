# Warning
It should be apparent from this file that this is a work in progress. Don't expect any part of the code to stay stable right now.

# Purpose
# Usage

# Taxonomy
* Reducers act on other reducers and will be flattened into a single value, often acting on data
* Operators act on 1 or more reducers, returning a single reducer
* Flatteners govern how operators act on reducers

# TODO
* Come up with a name for things (lib, flattener, reducer)
* Really needs better typing
* Write operators: or, exact/permissive
* Better cross-flattener use (?)
* Figure out what should be public API on launch and organize files accordingly
* More examples
* Actual docs
* Metadata annotations (name, description, etc)
* Arbitrary data path comparisons for validation
  * key1 OR key2 must exist
  * key1 AND key2 must exist
  * key1 XOR key2 must exist
* Build out relay example
* Figure out if there is a good way to share input/output graphql schemas

# Candidates for cross-flattener use
* use validate to determine which reducer to pick with an OR operator

# Possible features
* Async support
