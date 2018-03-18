const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {transformers} = require('@tolosa/transform-typescript')

module.exports = {
    entry: {
        'app': './src/index.tsx',
        // 'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
    },
    devtool: 'source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: () => transformers
                }
            }]
        }]
    },
    plugins: [
        // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
        new webpack.IgnorePlugin(
            /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
            /vs\/language\/typescript\/lib/
        ),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin()
    ]
}
