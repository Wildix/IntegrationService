var webpack = require("webpack");
var WebpackShellPlugin = require('webpack-shell-plugin');


function isVendorModule(module){
  // returns true for everything in node_modules
  return module.context && module.context.indexOf('node_modules') !== -1;
}

module.exports = {

    target: 'web',
    //devtool: 'cheap-module-source-map', // production
    devtool: 'source-map',

    context: __dirname + "/src",

    entry: {
        "IntegrationService": "./index.js",
        "IntegrationService.min": "./index.js",
    },

    resolve : {
        modules: ['node_modules', 'src'],
        alias: {
            //jquery: "./jquery-3.1.1.min.js",
            Logger: 'js-logger',
            ReconnectingWebSocket: 'reconnectingwebsocket'
        }
    },

    externals: {
        // require("jquery") is external and available
        // on the global var jQuery
        "jquery": "jQuery"
    },

    plugins : [
        //new webpack.IgnorePlugin(/^fs/), // disable, fs require
        // load modules as default
        new webpack.ProvidePlugin({
            'Logger': 'js-logger'
        }),
        /*new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: isVendorModule
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
            exclude: ["vendor.js"]
        }),*/
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            compress: {
                warnings: false
            },
            mangle: true,
            beautify: false,
            sourceMap: true,
            asdasd: true

        }),
        new WebpackShellPlugin({
            onBuildStart:[],
            //onBuildEnd:['/usr/bin/rsync -a --no-o --no-g --exclude=node_modules --exclude=.git --exclude=.* ./ ~/Documents/Mounted/10.100.1.243/www/IntegrationService/'],
            //onBuildExit: ['/usr/bin/rsync -a --no-o --no-g --exclude=node_modules --exclude=.git --exclude=.* ./ ~/Documents/Mounted/10.100.1.243/www/IntegrationService/'],
            safe: true
        })
    ],

    module: {
        rules: [{
              test: /\.js$/,
              exclude: /(node_modules)/,
              loader: "eslint-loader",
              options: {
                  configFile: ".eslintrc.js",
                  fix: true
              }
        }],
    },

    output: {
        libraryTarget: "umd",
        library: ["Wildix", "IntegrationService"],
        filename: "Wildix.[name].js",
        path: __dirname + '/dist'
    }
};
