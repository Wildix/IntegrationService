module.exports = {
    "debug": true,
    "globals": {
        "define": true,
        "Logger": true
    },
    "extends": [
        "standard"
    ],
    "plugins": [
        "standard"
    ],
    "rules": {
        "semi": ["error", "always"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "padded-blocks": ["error", { "blocks": "never", "classes": "always", "switches": "never" }],
        "space-before-function-paren": ["error", {"anonymous": "ignore", "named": "never", "asyncArrow": "ignore"}],


        "valid-jsdoc": ["error", {"requireReturn": true}],
        "default-case": ["error"],
        "no-else-return": ["error"],
        "no-eq-null": ["error"],
        "no-extra-bind": ["error"],
        // "no-invalid-this": ["error"],
        // "camelcase": ["error", {"properties": "always"}],
        "max-nested-callbacks": ["error", 2],
        "max-statements-per-line": ["error", { "max": 1 }],
        "multiline-ternary": ["error", "never"],
        /*"require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": true,
                "ClassDeclaration": true
            }
        }],*/


        "space-before-blocks": ["off", { "functions": "always", "keywords": "always", "classes": "always" }],
        "keyword-spacing": ["off", { "overrides": {
              "if": { "after": false },
              "for": { "after": false },
              "while": { "after": false }
            } }],
        "eqeqeq": ["off", "always"]
    }
}
