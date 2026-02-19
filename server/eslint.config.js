const globals = require('globals');
const pluginJs = require('@eslint/js');

module.exports = [
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021
            },
            sourceType: "commonjs"
        }
    },
    pluginJs.configs.recommended,
    {
        rules: {
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "no-console": "off",
            "no-undef": "error"
        }
    }
];
