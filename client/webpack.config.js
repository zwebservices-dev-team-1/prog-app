const path = require('path');
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
    dist: path.join(__dirname, 'dist')
};

const pkg = require('./package.json');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '';
const ENVIRONMENT = (TARGET === 'serve') ? 'development' : 'production';
const EnvironmentSettings = require(PATHS.app + '/environment/' + ENVIRONMENT);

const common = {
    context: PATHS.app,
    // Entry accepts a path or an object of entries. We'll be using the
    // latter form given it's convenient with more complex configurations.
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.dist,
        filename: '[name].js',
        chunkFilename: '[id].[chunkhash].js',
        publicPath: ASSET_PATH
    },
    node: {
        __filename: true,
        __dirname: true
    },
    cache: true,
    module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|vendor)/,
            // loader: "ng-annotate-loader!babel-loader?presets[]=es2015",
            include: PATHS.app,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: [
                        require('babel-plugin-transform-object-rest-spread'),
                        require('babel-plugin-transform-object-entries'),
                        require('babel-plugin-transform-object-assign'),
                        require('@59naga/babel-plugin-transform-array-from')
                    ]
                }
            }
        },
                {
                    test: /\.(png|svg|jpg|gif|woff|eot|ttf|woff2?49710509|woff2?v=4.7.0|)$/,
                    use: [
                        'file-loader'
                    ]
                },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
               fallback: "style-loader",
                use: "css-loader?minimize=true&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap=true"}
        )
        },

        {
            test: require.resolve('./app/project_media/vendor/js/pidcrypt.min.js'),
            use: 'exports-loader?PidCrypt'
        },
        {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }
    ]
  },
    resolve: {
        alias: {
            'PidCryptFn': path.resolve(__dirname, './app/project_media/vendor/js/pidcrypt.min'),
            'ejs': path.resolve(__dirname, './app/project_media/vendor/js/ejs.min'),
            'Settings': path.resolve(__dirname, './app/environment/' + ENVIRONMENT)
        }
    },
    plugins: [
        new CopyWebpackPlugin(['./sw.js']),
        new webpack.IgnorePlugin(/^\.\/sw\.js$/),
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new ExtractTextPlugin("[name].css"),
        new webpack.ProvidePlugin({
            PidCryptFn: "PidCryptFn",
            _: "lodash",
            Q: "Q",
            Rx: "rxjs/Rx",
            ejs: "ejs",
            Settings: "Settings",
            ExpiredStorage: "expired-storage"
        }),
        new HtmlWebpackPlugin({
            template: './layout.ejs',
            title: `${pkg.description}`,
            hash: true,
            xhtml: true,
            showErrors: false,
            version: `v${pkg.version}`
        }),
        // new ResourceHintWebpackPlugin(),
        // This makes it possible for us to safely use env vars on our code
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
            ENVIRONMENT: JSON.stringify(ENVIRONMENT),
            'Settings.portalHost': JSON.stringify(EnvironmentSettings.portalHost)
        })
    ],
    externals: {}
};

// Default configuration
if (TARGET === 'serve' || !TARGET) {

    module.exports = merge(common, {
        devtool: 'inline-source-map',
        devServer: {
            contentBase: PATHS.dist,

            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,
            hot: true,
            inline: true,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
            //
            // If you use Vagrant or Cloud9, set
            // host: process.env.HOST || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices unlike default
            // localhost
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if (TARGET === 'build') {
    module.exports = merge(common, {
        plugins: [
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: { ecma: 8 },
                test: /\.js($|\?)/i
            })
        ]
    });
}