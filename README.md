# Warning
It should be apparent from this file that this is a work in progress. Don't expect any part of the code to stay stable right now.

# Purpose
# Usage

# TODO
* Come up with a name for things (lib, flattener, reducer)
* Really needs better typing
* Write operators: and, or, optional/required, exact/permissive
* How to handle name key on functions in updater
  * Rename 'name' -> 'Name'
  * Map all of the setters to set[camelcased-key-name]
  * ???
* Cross-flattener use (?)
* Figure out what should be public API on launch and organize files accordingly
* More examples
* Actual docs
* Finish TODO tests
* Add ability to remove a key on updater

# Candidates for cross-flattener use
* use validate to determine which reducer to pick with an OR operator
* Array pushes add the child's shape, rather than the argument value

# Possible features
* Graphql support - build your schema
* Async support
