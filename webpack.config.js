require("@babel/polyfill")
const path = require("path")
const htmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")
const TestWebpackPlugin = require("./myPlugins/test-webpack-plugin")
const AresWebpackPlugin = require("./myPlugins/ares-webpack-plugin")
const pkg = require("./package.json")
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "./myLoaders/")],
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          // MiniCssExtractPlugin.loader,
          // "css-loader",
          // "postcss-loader",
          // "less-loader",
          "myStyle-loader",
          "myCss-loader",
          "myLess-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[name]_[hash:6].[ext]",
              outputPath: "images",
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          //   {
          //     loader: "babel-loader",
          //     options: {
          //       presets: [
          //         [
          //           "@babel/preset-env",
          //           {
          //             targets: {
          //               edge: "17",
          //               firefox: "60",
          //               chrome: "67",
          //               safari: "11.1",
          //             },
          //             //新版本需要指定核心库版本
          //             corejs: 2,
          //             // useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置 @babel/polyfill 。
          //             // 它有三 个参数可以使用: `entry`: 需要在 webpack 的入口文件里 import "@babel/polyfill" 一次。 babel 会根据你的使用情况导入垫片，没有使用的功能不会被导入相应的垫片。
          //             // `usage`: 不需要 import ，全 自动检测，但是要安装 @babel/polyfill 。
          //             // `false`: 如果你 import "@babel/polyfill" ，它不会排 除掉没有使用的垫片，程序体积会庞大。(不推荐)
          //             useBuiltIns: "entry",
          //           },
          //         ],
          //       ],
          //     },
          //   },
          "replace-loader-async",
          {
            loader: "replace-loader",
            options: {
              str: "hi",
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9090,
    hot: true,
    hotOnly: true,
  },
  plugins: [
    new TestWebpackPlugin({
      name: "timokie",
    }),
    new AresWebpackPlugin({
      group: "hotel",
      name: "ebkmisc-resource",
      version: pkg.version,
    }),
    new htmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
