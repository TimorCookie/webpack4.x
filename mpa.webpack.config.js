const path = require("path")
const htmlWebpackPlugin = require("html-webpack-plugin")
const miniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const glob = require("glob")

const entryfiles = glob.sync(path.resolve(__dirname, "./src/pages/*/index.js"))

const setMpa = () => {
  const entry = {}
  const htmlwebpackplugins = []

  entryfiles.map((el, index) => {
    const match = el.match(/src\/pages\/(.*)\/index\.js$/)
    const pageName = match[1]

    entry[pageName] = el

    htmlwebpackplugins.push(
      new htmlWebpackPlugin({
        filename: `${pageName}.html`,
        template: path.join(
          __dirname,
          `./src/pages/${pageName}/${pageName}.html`
        ),
        title: "hello, webpack4.x",
        chunks: [pageName],
      })
    )
  })

  return { entry, htmlwebpackplugins }
}
const { entry, htmlwebpackplugins } = setMpa()

module.exports = {
  // entry: {
  //   index: "./src/index.js",
  //   home: "./src/home.js",
  //   list: "./src/list.js",
  // },
  entry,
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./mpa"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        // style-loader 安装2.x版本
        use: [miniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        // style-loader 安装2.x版本; sass-loader 安装10.x版本
        use: [
          miniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.less$/,
        // style-loader 安装2.x版本; sass-loader 安装10.x版本; less-loader 安装7.x版本; postcss-loader安装6.x版本
        use: [
          miniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, //小于此值的文件会被转换成DataURL
              name: "[name]_[hash:6].[ext]", // 设置输出文件的名字
              outputPath: "assets", // 设置资源输出的目录
            },
          },
          {
            loader: "image-webpack-loader",
            // options: {
            //   bypassOnDebug: false, // webpack@1.x
            //   disable: false, // webpack@2.x and newer
            // },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new miniCssExtractPlugin(),
    new CleanWebpackPlugin({
      filename: "index.css",
    }),
    // new htmlWebpackPlugin({
    //   filename: "index.html",
    //   template: "./src/index.html",
    //   title: "hello, webpack4.x",
    //   chunks: ["index"],
    // }),
    // new htmlWebpackPlugin({
    //   filename: "home.html",
    //   template: "./src/home.html",
    //   title: "hello, webpack4.x",
    //   chunks: ["home"],
    // }),
    // new htmlWebpackPlugin({
    //   filename: "list.html",
    //   template: "./src/list.html",
    //   title: "hello, webpack4.x",
    //   chunks: ["list"],
    // }),
    ...htmlwebpackplugins,
  ],
}
