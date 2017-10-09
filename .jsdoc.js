'use strict';

module.exports = {
    "plugins": [],
    "recurseDepth": 10,
    "source": {
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
        "default": {
            "outputSourceFiles": false,
            "includeDate": false,
            "useLongnameInNav": false
        }
    },
    "opts": {
        "template": "templates/default",  // same as -t templates/default
        //"template": "node_modules/tui-jsdoc-template",
        //"template": "node_modules/docdash",
        //"template": "node_modules/minami",
        //"template": "node_modules/postman-jsdoc-theme",
        //"template": "node_modules/jaguarjs-jsdoc",

        "encoding": "utf8",               // same as -e utf8
        "destination": "./docs/",         // same as -d ./out/
        "recurse": true,                  // same as -r
        "debug": true,                    // same as --debug
        "readme": "./README.md"
        //"package": "./package.json",       // same as --package
        //"tutorials": "./tutorials/"    // same as -u path/to/tutorials
    }
};
