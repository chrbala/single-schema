const createLinter = require('chrbala-linter');
const l = createLinter({modules: ['eslint', 'flow', 'react']});
delete l.rules.indent;
l.rules['object-curly-spacing'] = [2, 'always'];
module.exports = l;
