// @flow

import PropTypes from './proptypes';

export default (child: * = PropTypes.any) => () => () => child.isOptional;
