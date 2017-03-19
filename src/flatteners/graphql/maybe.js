// @flow

import wrap from './wrap';

export default wrap(({ getNullableType }) => data => getNullableType(data));
