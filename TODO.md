# TODO
* Async state support
  * Add another function in reducers to allow state that exists before children are registered

# Possible features
* Write operators: or, subset
* Arbitrary data path comparisons for validation
  * key1 OR key2 must exist
  * key1 AND key2 must exist
  * key1 XOR key2 must exist
* Better caching on validator/coercer