const { resolve } = require('path');
//自动清除包
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// html 压缩
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 分离 css 成单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');  // pwa
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');  //dll

let env = process.env.NODE_ENV;
console.log('env==>>',env);

//这个配置文件，其实就是一个JS文件，通过 Node中的模块操作，向外暴露了一个配置对象
module.exports = {
    // 入口，表示webpack打包哪个文件
    // entry: './src/index.js',
    entry: {
        index: './src/index.js',
        print: './src/print.js',
    },

    //输出相关文件的配置
    output: {
        filename: '[name].[contenthash:10].js',//这指定输出文件的名称  
        path: resolve(__dirname, 'build'),  // 输出文件目录（将来所有资源输出的公共目录）
        // publicPath: '/build',    // 所有资源引入公共路径前缀 --> 'imgs/a.jpg' --> '/imgs/a.jpg'
        // chunkFilename: 'js/[name].[contenthash:10]_chunk.js', // 指定非入口文件的其他chunk的名字加_chunk
        // library: '[name]', // 打包整个库后向外暴露的变量名
        // libraryTarget: 'window',  // 变量名添加到哪个上 browser：window
        // libraryTarget: 'global',  // node：global
        // libraryTarget: 'commonjs',// conmmonjs模块 exports
    },

    //这个节点用于配置所有第三方模块加载器
    module: {
        //所有第三方模块的匹配规则
        rules: [
            {
                //配置 Babel 来转换高级的ES语法, 高版本js的兼容性处理
                test: /\.js$/, 
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    // 开启babel缓存
                    // 第二次构建时，会读取之前的缓存
                    cacheDirectory: true,
                }
            },
            // {
            //     loader: 'thread-loader',
            //     options: {
            //       workers: 2 // 进程2个
            //     }
            // },
            {
                test: /\.css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                // 处理图片资源,但是处理不了html中img的路径问题//处理图片路径的 loader 
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8*1024,  // 8k以内, 转成base64, 节约请求次数, 8k以外, 单独一个文件请求
                    name: '[name].[hash:10].[ext]', //不重复名字
                    // 配置静态资源的引用路径，解决背景图片加载问题
                    publicPath: "/images",
                    // 配置输出的文件目录
                    outputPath: "images/"
                },
            },
            {
                test:/\.html$/,
                loader:'html-loader'
            },


        ]
    },

    // 插件
    plugins: [
        // 自动生成 html 的插件
        new HtmlWebpackPlugin({
            title: '管理输出',
            template: resolve(__dirname, 'index.html'),//指定模板页面，将来会根据指定的模板页面路径去生成内存中的页面
            filename: 'index.html',//指定生成页面的名称
            minify: false,
            // minify: { //对html文件进行压缩
            //     collapseWhitespace: true,
            //     removeComments: true,
            // }
        }),
        // 分离css的插件
        new MiniCssExtractPlugin(
            {filename: 'css/common.css'}
        ), 
        new CleanWebpackPlugin(),   // 清除dist目录不再使用的文件， watch监听清理修改部分
        new OptimizeCssAssetsWebpackPlugin(), // 压缩css
        /* // pwa
        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }), */

        /* //dll 
        // 告诉webpack哪些库不参与打包，同时使用时的名称也得变
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, 'dll/manifest.json')
        }),
        // 将某个文件打包输出到build目录下，并在html中自动引入该资源
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/jquery.js')
        }) */
    ],


    // 服务器配置，实时重载（自动编译、打开/刷新浏览器）
    devServer: {
        // publicPath: '/', // 用于确定 bundle 的来源，并具有优先级高于 contentBase。
        contentBase: resolve(__dirname, 'build'), // 运行代码所在的目录
        compress: false, // 启动gzip压缩 build/ 目录当中的所有内容
        port: 5188,      // 端口号
        open: true,      // 自动打开浏览器
        hot: true,       // 开启HMR功能：当修改了webpack配置，一定要重启webpack服务才会生效
        // watchContentBase: true,     // 监视contentBase目录下的所有文件，一旦文件变化就会reload
        // watchOptions: {         
        //     ignored: /node_modules/ // 忽略文件
        // },
        // quiet: true,            // 除了一些基本信息外，其他内容都不要显示
        // overlay: false,         // 如果出错了，不要全屏提示
        // host: 'localhost',      // 域名
        // clientLogLevel: 'none', // 不要显示启动服务器日志信息
        // proxy: {                // 服务器代理  -->  解决开发环境跨域问题
        //     '/api': {           // 一旦devServer(5188)服务器接收到/api/xxx的请求，就会把请求转发到另外一个服务器3000
        //         target: 'http://localhost:3000',
        //         pathRewrite: {// 发送请求时，请求路径重写：将/api/xxx --> /xxx （去掉/api）
        //             '^/api': ''
        //         }
        //     }
        // }
    },


    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

    devtool: 'inline-source-map',   //source-map：源映射，追踪错误源
    mode: 'production',    // 运行模式： development开发模式、production生产模式

    // 解析模块的规则     （这样配置后，引入文件就可以这样简写：import '$css/index';）
    resolve: {
        alias: {  // 模块别名列表
            $css: resolve(__dirname, 'src/css'),
            // store: resolve('./common/util/store/store'), //引入 import store from 'store'
        },
        extensions: ['.js', '.json', '.jsx', '.css'],  // 使用的扩展名（引入时不必加扩展名）
    },

    
    // 外部扩展, 阻止了jquery打包到build文件中
    // 属性名称是 jquery，表示应该排除 import $ from 'jquery' 中的 jquery 模块。为了替换这个模块，jQuery 的值将被用来检索一个全局的 jQuery 变量。
    // externals: {
    //     jquery: 'jQuery'
    // },
    performance: {
        hints: false
    }
};