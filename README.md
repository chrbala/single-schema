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
* Build out map type
* Build out ability to set field options from the field itself
* Build out in-memory database for graphql example 
* Build out relay example

# Candidates for cross-flattener use
* use validate to determine which reducer to pick with an OR operator

# Possible features
* Async support
