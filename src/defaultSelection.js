// @flow

import Coercer from './flatteners/coercer';
import Shaper from './flatteners/shaper';
import Updater from './flatteners/updater';
import Validator from './flatteners/validator';
import PropType from './flatteners/proptype';

export default {
	validate: Validator({cache: true}),
	coerce: Coercer({cache: true}),
	shape: Shaper({leafNode: undefined}),
	createUpdate: Updater(),
	proptype: PropType(),
};
