const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        app: path.resolve(__dirname, 'src/App.js'),
        main: path.resolve(__dirname, 'src/components/Main/Main.js'),
        Info: path.resolve(__dirname, 'src/components/Info/Info.js'),
        Pay: path.resolve(__dirname, 'src/components/Pay/Pay.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(png|svg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}