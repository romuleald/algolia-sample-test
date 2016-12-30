var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './src/js/entry'
    ],
    output: {
        path: path.join(__dirname, 'assets/js'),
        filename: 'main.js',
        publicPath: ''
    },
    devtool: "#inline-source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                //include: path.join(__dirname, 'js'),
                query: {
                    compact: false,
                    presets: ['es2015']
                }
            }
        ]
    }
};


