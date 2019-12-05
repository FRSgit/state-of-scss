const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prefix = '';
const nextClassName = require('incstr').idGenerator({
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-',
    prefix
});

module.exports = (env, {mode, ex}) => ({
    entry: {
        'ex': './ex' + ex + '/index.js' 
    },
    output: {
        path: path.resolve(__dirname, 'ex' + ex, 'dist')
    },
    resolve: {
        extensions: ['.js', '.pug']
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            doctype: false
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                sideEffects: true,
                use: [
					'style-loader',
                    {
                        loader: 'css-loader',
                        options: (() => 
							ex === '3-pug' ? {} : {
								modules: {
									getLocalIdent: mode === 'production'
										? nextClassName
										: (context, localIdentName, localName) => {
											const resourcePath = context.resourcePath.replace(/[\/\\]/g, '/'); // unify path-separator character under different OSes

											const path = resourcePath
												.substring(0, resourcePath.lastIndexOf('/'))
												.substring(context.rootContext.length + 1) // removes src/ prefix
												.replace(/[\/\\]/g, '-'); // replace all path-separators with something more classy
	
											return (path ? (path + '__') : '') + localName
										}
								},
								importLoaders: 2,
							}
						)()
                    },
                    'sass-loader'
                ]
            }
        ],
    },
    plugins:
        [
            new HtmlWebpackPlugin()
        ],
    devtool: 'source-map'
});
