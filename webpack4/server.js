/*
 * 通过 Node.js API 使用 webpack-dev-server。 等同于webpack.config.js中的devServer
 * 中间件 webpack-dev-middleware 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server
 * 启动指令 node server.js
 */

const express = require('express');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware')

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

/* // 告知 express 使用 webpack-dev-middleware，以及将 webpack.config.js 配置文件作为基础配置。
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,  
}));
// 如果你正在使用 webpack-dev-middleware，可以通过 webpack-hot-middleware 依赖包，在自定义 dev server 中启用 HMR。
// app.use(WebpackHotMiddleware(compiler));

// 
app.use(express.static('build', {maxAge: 1000 * 3600}))

// 将文件 serve 到 port 3000。
app.listen(3000, '127.0.0.1', () => {
  console.log('Example app listening on port 3000!\n');
}); */



// 使用webpack-dev-server：devServer的配置
const options = {
  contentBase: './build',
  host: 'localhost',
};

webpackDevServer.addDevServerEntrypoints(config, options);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});

