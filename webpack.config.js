const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // entry file
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: {
    app: './src/js/frontend/app.js',
    login: './src/js/frontend/controller/login.js',
    main: './src/js/frontend/controller/main.js',
    group: './src/js/frontend/controller/group.js',
    newstudy: './src/js/frontend/controller/newstudy.js',
    posting: './src/js/frontend/controller/posting.js',
    mypage: './src/js/frontend/controller/mypage.js',
    point: './src/js/frontend/controller/point.js',
    nav: './src/js/frontend/controller/nav.js',
    notice: './src/js/frontend/controller/notice.js',
    setting: './src/js/frontend/controller/setting.js',
  },
  // 번들링된 js 파일의 이름(filename)과 저장될 경로(path)를 지정
  // https://webpack.js.org/configuration/output/#outputpath
  // https://webpack.js.org/configuration/output/#outputfilename
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['app', 'main', 'nav'],
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'src/template/login.html',
      chunks: ['app', 'login'],
    }),
    new HtmlWebpackPlugin({
      filename: 'newstudy.html',
      template: 'src/template/newstudy.html',
      chunks: ['app', 'newstudy', 'nav'],
    }),
    new HtmlWebpackPlugin({
      filename: 'posting.html',
      template: 'src/template/posting.html',
      chunks: ['app', 'posting', 'nav'],
    }),
    new HtmlWebpackPlugin({
      filename: 'group.html',
      template: 'src/template/group.html',
      chunks: ['app', 'group', 'nav'],
    }),
    new HtmlWebpackPlugin({
      filename: 'mypage.html',
      template: 'src/template/mypage.html',
      chunks: ['app', 'mypage', 'nav'],
    }),
    new HtmlWebpackPlugin({
      filename: 'point.html',
      template: 'src/template/point.html',
      chunks: ['app', 'point', 'nav'],
    }),
    new HtmlWebpackPlugin({
      filename: 'notice.html',
      template: 'src/template/notice.html',
      chunks: ['app', 'notice', 'nav'],
    }),
    new HtmlWebpackPlugin({
      filename: 'setting.html',
      template: 'src/template/setting.html',
      chunks: ['app', 'setting', 'nav'],
    }),
    new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src/images'),
          to: path.join(__dirname, 'public/images'),
        },
      ],
    }),
  ],
  // https://webpack.js.org/configuration/module
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  // https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs
                  corejs: 3,
                  proposals: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    // https://webpack.js.org/configuration/dev-server/#devserverstatic
    static: {
      // https://webpack.js.org/configuration/dev-server/#directory
      directory: path.join(__dirname, 'public'), //
    },
    // https://webpack.js.org/configuration/dev-server/#devserveropen
    open: true,
    // https://webpack.js.org/configuration/dev-server/#devserverport
    port: 'auto',
    proxy: {
      '/': {
        target: 'http://localhost:3001/',
        pathRewrite: { '^/': '/' },
      },
    },
  },
  // 디버깅용이기 때문에 개발할 때만 필요하고 배포할 땐 필요가 없다.
  devtool: 'source-map',
  // https://webpack.js.org/configuration/mode
  mode: 'development',
};

// proxy routers
// [
// {
//   context: router.news,
//   target: 'http://localhost:3000/',
// },
// {
//   context: router.interview,
//   target: 'http://localhost:3000/',
// },
// {
//   context: router.questionList,
//   target: 'http://localhost:3000/',
// },
// {
//   context: router.user,
//   target: 'http://localhost:3000/',
// },
// ],
