const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'chim.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
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
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 6,
                warnings: false,
                mangle: false,
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
};
