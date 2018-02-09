module.exports = {
    entry: {
        app: ['babel-polyfill', './src/js/app.js']
    },
    output: {
        path: __dirname,
        filename: 'cachemoney.js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env', 'stage-0']
            }
        }]
    }
}
