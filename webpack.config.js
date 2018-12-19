const webpack = require('webpack');  // 引入webpack插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLess = new ExtractTextPlugin({
    filename: 'css/[name].css'
});

module.exports = {
    // 入口文件
    entry: {
        login: './src/js/login.js',
        index: './src/js/index.js',
        home: './src/js/home.js',
        userFile: './src/js/user-file.js',
        editPass: './src/js/edit-pass.js',
        forgetPass: './src/js/forget-pass.js',
        ace: './src/js/ace.js',
        // common: './src/js/common.js'  // 公共样式
    },
    // 输出
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].js',
        // publicPath: 'https://zjyegt.cn'  // 公共目录，项目上线的时候配置
    },
    // 插件
    plugins: [
        new CleanWebpackPlugin(['dist/']),
        new webpack.optimize.CommonsChunkPlugin({
            // name: ['jquery'],  // 公共 chunk的名称
            name: ['jquery'],  // 抽离webpack运行文件
            filename: 'js/[name].js',
            // minChunks: 2,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['errorCode'],  // 公共 chunk的名称
            filename: 'js/[name].js',
            chunks: ['login', 'userFile'],
            // minChunks: 2,
        }),
        new webpack.optimize.UglifyJsPlugin({  // 压缩代码
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({  // index页
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['index', 'jquery']
        }),
        new HtmlWebpackPlugin({  // 用户登陆
            filename: 'login.html',
            template: './src/login.html',
            chunks: ['login', 'jquery', 'errorCode']
        }),
        new HtmlWebpackPlugin({  // 用户注册
            filename: 'register.html',
            template: './src/register.html',
            chunks: ['login', 'jquery', 'errorCode']
        }),
        new HtmlWebpackPlugin({  // home页
            filename: 'home.html',
            template: './src/home.html',
            chunks: ['home', 'jquery']
        }),
        new HtmlWebpackPlugin({  // 用户文件
            filename: 'user-file.html',
            template: './src/user-file.html',
            chunks: ['userFile', 'jquery', 'errorCode']
        }),

        new HtmlWebpackPlugin({  // 修改密码
            filename: 'edit-pass.html',
            template: './src/edit-pass.html',
            chunks: ['editPass', 'jquery']
        }),

        new HtmlWebpackPlugin({  // 忘记密码
            filename: 'forget-pass.html',
            template: './src/forget-pass.html',
            chunks: ['forgetPass', 'jquery']
        }),

        new HtmlWebpackPlugin({  // ace编辑器
            filename: 'ace.html',
            template: './src/ace.html',
            chunks: ['ace', 'jquery']
        }),

        // new HtmlWebpackPlugin({  // test页
        //     filename: 'test.html',
        //     template: './src/test.html',
        //     chunks: ['home', 'jquery']
        // }),

        extractLess,  // 分离less样式
        new CopyWebpackPlugin([{
            from: __dirname + '/src/lib/ace-builds-master/src-noconflict',  // 打包前的静态资源的目录地址
            to: __dirname + '/dist/lib/ace-builds-master/src-noconflict'  // 打包后的静态资源存放的目录地址
        }])
    ],
    module: {
        loaders: [
            {   // 暴露全局变量
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {  // 转换ES6语法
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {   // 处理图片路径并打包压缩图片
                test: /\.(png|jpg|gif|svg)$/i,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'file-loader?name=[name].[ext]&outputPath=images/',
                    {
                        loader: 'image-webpack-loader',
                    },
                ],
            },
            {   // 处理字体文件
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'file-loader?name=[name].[ext]&outputPath=font'
                ],
            },
            {  // 打包处理模版的normalize.css文件的路径
                test: /normalize\.css$/i,
                include: /src/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'css/'
                }
            },
            {  // 打包webuploader.css文件的路径
                test: /webuploader\.css$/i,
                include: /src/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'css/'
                }
            },
            {
                test: /\.less$/,
                exclude: /(node_modules|bower_components)/,
                use: extractLess.extract({
                    use:[  // 指需要什么样的loader去编译文件
                        {loader:'css-loader'},
                        {loader:'less-loader'}
                    ],
                    fallback: 'style-loader',  // 编译后用什么loader来提取css文件
                    publicPath: './../'
                })
            }
        ]
    },
    devServer: {
        contentBase: "./dist",  // 本地服务器所加载的页面所在的目录
        historyApiFallback: true,  // 不跳转,开启单页应用
        // historyApiFallback: {
        //     rewrites: [
        //         {from: /^\/test/, to: '/test.html'},
        //         {from: /./, to: '/index.html'}
        //     ]
        // }, // 多页应用跳转，指定路由
        inline: true,  // 实时刷新
        port: 9096,  // 端口号，默认为8080
        host: '0.0.0.0',
        // hot: true,  // 开启热更新
        // disableHostCheck: true  // 配置是否关闭用于DNS重新绑定的HTTP的HOST检查,通常用于搭配--host 0.0.0.0 使用
    }
};