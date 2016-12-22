// @flow

import PropTypes from './proptypes';

export default (child: * = PropTypes.any) => () => () => 
	PropTypes.arrayOf(child)
;
