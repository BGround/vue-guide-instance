const webpack = require('webpack')
const path = require('path')                                             //path是Nodejs中的基本包,用来处理路径
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    mode: isDev ? 'development' : 'production',
    target: "web",                                                       //设置webpack的编译目标是web平台
    entry: path.join(__dirname, './src/index.js'),                       //声明js文件入口,__dirname就是我们文件的根目录,用join拼接
    output: {                                                            //声明出口文件
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    stats: {
        children: false,
        errorDetails: true
    },
    performance: { hints: false },
    module: {                                                             //因为webpack只能处理js文件,且只识别ES5的语法
        rules: [                                                          //所以针对不同类型的文件,我们定义不同的识别规则,最终目的都是打包成js文件
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader'
            //     ]
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'stylus-loader'
                ]
            },
            {
                test: /\.(jpg|gif|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin(),
        new VueLoaderPlugin()
    ]
}
// config.devtool = isDev ? false : '#cheap-module-eval-source-map'     //官方推荐使用这个配置,作用是在浏览器中调试时,显示的代码和我们的项目中的代码会基本相似,而不会显示编译后的代码,以致于我们调试连自己都看不懂
if(isDev) {
    config.devServer = {                                             //这个devServer的配置是在webpack2.x以后引入的,1.x是没有的
        port: 8000,
        host: '0.0.0.0',                                             //可以设置0.0.0.0 ,这样设置你可以通过127.0.0.1或则localhost去访问
        overlay: {
            errors: true,                                            //编译中遇到的错误都会显示到网页中去
        },
        // open: true ,                                              //项目启动时,会默认帮你打开浏览器
        hot: true                                                   //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后,将只刷新对应的组件
    }
    config.devtool = isDev ? false : '#cheap-module-eval-source-map' //webpack5+版本下需要严格设置'false'
    config.plugins.push(                                            //添加两个插件用于hot:true的配置
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}

module.exports = config
