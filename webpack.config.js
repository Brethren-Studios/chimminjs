const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
require('@babel/plugin-proposal-object-rest-spread');

const minConfig = {
    name: 'minified',
    mode: 'production',
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'chim.min.js'
    },
    module: {
        rules: [
            {
                test: [/\.js$/, /\.es6$/],
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                // https://github.com/mishoo/UglifyJS2#minify-options
                uglifyOptions: {
                    ecma: 5,
                    warnings: false,
                    mangle: false,
                    compress: {
                        // hides log but not warning or error
                        pure_funcs: ['console.log']
                    },
                    output: {
                        comments: false,
                        beautify: false
                    },
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                }
            })
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};

const debugConfig  = {
    name: 'debug',
    mode: 'development',
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'chimmin.js'
    },
    module: {
        rules: [
            {
                test: [/\.js$/, /\.es6$/],
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};

module.exports = [
    minConfig,
    debugConfig
];
