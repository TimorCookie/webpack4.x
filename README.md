
## 简介

本质上，**webpack** 是一个现代 JavaScript 应用程序的*静态模块打包工具*。当 webpack 处理应用程序时，它会在内部构建一个 [依赖图(dependency graph)](https://v4.webpack.docschina.org/concepts/dependency-graph/)，此依赖图会映射项目所需的每个模块，并生成一个或多个 *bundle*。

**webpack** 是一个打包模块化JavaScript的工具，它会从入口模块出发，识别出源码中的模块化导入语句，递归 地找出入口文件的所有依赖，将入口和其所有的依赖打包到一个单独的文件中

是工程化、自动化思想在前端开发中的体现。

*webpack5.x已经在去年10.1国庆期间发布上线，但是考虑到不稳定性，和生态插件的更新，所以这次分享 仍以webpack4.x版本为主。(`webpack@4.43.0`，`webpack-cli@3.3.12`)*



[webpack4.x文档](https://v4.webpack.docschina.org/concepts/)

[webpack5.x文档](https://webpack.docschina.org/concepts/)



## webpack 安装



### 环境准备

[nodeJs](https://nodejs.org/en/)

版本参考官网发布的最新版本，可以提升webpack的打包速度



### 安装方式

1. **局部安装（推荐）**

   ```bash
   # 安装webpack V4+版本时，需要额外安装webpack-cli 
   npm install webpack@4.44.0 webpack-cli@3.3.12 -D
   ```

   

2. **全局安装（不推荐）**

   ```bash
   npm install webpack@4.44.0 webpack-cli@3.3.12 -g
   ```

   全局安装webpack，这会将你项目中的webpack锁定到指定版本，造成不同的项目可能因为webpack依赖不同版 本而导致冲突，构建失败



## 配置核心概念



- `chunk`:指代码块，一个 chunk 可能由多个模块组合而成，也用于代码合并与分割。
-  `bundle`:资源经过 Webpack 流程解析编译后最终结输出的成果文件。
- `entry`:顾名思义，就是入口起点，用来告诉 webpack 用哪个文件作为构建依赖图的起点。 webpack 会根据 entry 递归的去寻找依赖，每个依赖都将被它处理，最后输出到打包成果中。
- `output`:描述了 webpack 打包的输出配置，包含输出文件的命名、位置等信息。
-  `loader`:默认情况下，webpack 仅支持 .js .json 文件，通过 loader，可以让它解析其他类型的文件，充当翻译官的⻆色。理论上只要有相应的 loader，就可以处理任何类型的文件。
-  `plugin`: loader 主要的职责是让 webpack 认识更多的文件类型，而 plugin 的职责则是让其可以控制构建流程，从而执行一些特殊的任务。插件的功能非常强大，可以完成各种各样的任务。
-  `mode`: 4.0开始，webpack 支持零配置，旨在为开发人员减少上手难度，同时加入了 mode 的概 念，用于指定打包的目标环境，以便在打包的过程中启用webpack 针对不同的环境下内置的优化



## 小试牛刀



### 零配置版（4.x的噱头）

- 创建一个前端工程化项目

  ```bash
  # 新建项目文件夹
  mkdir wpdemo
  cd wbpdemo
  # 项目初始化
  npm init -y
  # 安装 webpack 依赖
  npm install webpack@4.44.0 webpack-cli@3.3.12 -D
  mkdir src
  touch index.js
  vim index.js
  ```

  

- 执行打包命令

  ```bash
  npx webpack
  ```

  会发现目录下多出一个 dist 目录，里面有个 main.js ，这个文件是一个可执行的JavaScript文件， 里面包含webpackBootstrap启动函数。



### 配置版

webpack 有默认的配置文件，`webpack.config.js` ，我们可以对这个文件进行修改，进行个性化配置
不使用自定义配置文件: 比如 `webpackconfig.js`，可以通过`--config webpack.config.js `来指定 webpack 使用哪个配置文件来执行构建

```javascript
// webpack.config.js
module.exports = {
  //打包入口文件 
  entry: "./src/index.js", 
  output: {
    //输出文件的名称
    filename: "bundle.js",
    //输出文件到磁盘的目录，必须是绝对路径
    path: path.resolve(__dirname, "dist")
  },
  mode: "production", //打包环境
  module: {
    rules: [ 
        {
            test: /\.css$/,
            // css-loader 分析css模块之间的关系，并合成一个css
            // Style-loader 会把css-loader生成的内容，以style挂载到⻚面的heade部分
            use: ["style-loader", "css-loader" ]
          }
     ] },
  //插件配置
  plugins: [new HtmlWebpackPlugin()] 
};
```



- **entry：**

  https://v4.webpack.docschina.org/concepts/entry-points

  指定 webpack 打包入口文件, Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入

  ```javascript
   //单入口 SPA，本质是个字符串 
  entry:{
     main: './src/index.js' 
  }
  // 相当于简写 entry:"./src/index.js"
  //多入口 entry是个对象 
  entry:{
    index:"./src/index.js",
    login:"./src/login.js" 
  }
   
  ```

  

- **output:**

  https://v4.webpack.docschina.org/configuration/output/

  打包转换后的文件输出到磁盘位置:输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

  ```javascript
   
  output: {
    //输出文件的名称
    filename: "bundle.js",
    //输出文件到磁盘的目录，必须是绝对路径
    path: path.resolve(__dirname, "dist")
  },
  //多入口的处理 
  output: {
    //利用占位符，文件名称不要重复
    filename: "[name][chunkhash:8].js",
    //输出文件到磁盘的目录，必须是绝对路径 
    path: path.resolve(__dirname, "dist")
  },
  ```

- **mode**

  https://v4.webpack.docschina.org/concepts/mode/

  mode用来指定当前的构建环境（production || development || none），设置mode可以自动触发webpack内置的函数，达到优化的效果 

  - 开发阶段的开启会有利于热更新的处理，识别哪个模块变化

  - 生产阶段的开启会有帮助模块压缩，处理副作用等一些功能

- **moudle**

  https://v4.webpack.docschina.org/configuration/module/

  模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找 出所有依赖的模块。

  当webpack处理到不认识的模块时，需要在 webpack 中的 module 处进行配置，当检测到是什么格式的模块，使用什么loader来处理。

  ```javascript
   
  module:{
    rules:[
      {
        //指定匹配规则 
        test:/\.xxx$/, 
        use:{
          //指定使用的loader
          loader: 'xxx-load'
        }
      }
  	] 
  }
  ```

  

- **loader**

  https://v4.webpack.docschina.org/concepts/loaders/

  模块解析，模块转换器，用于把模块原内容按照需求转换成新内容。 webpack 是模块打包工具，而模块不仅仅是 js，还可以是 css，图片或者其他格式

  但是webpack默认只知道如何处理 **js** 和 **JSON** 模块，那么其他格式的模块处理，和处理方式就需要 loader 了

  常⻅的loader：

  ```javascript
  style-loader
  css-loader
  less-loader
  sass-loader
  ts-loader //将Ts转换成js babel-loader//转换ES6、7等js新特性语法 file-loader//处理图片子图 eslint-loader
  ```

  

- **plugins**

  https://v4.webpack.docschina.org/concepts/plugins/

  plugin 可以在 webpack 运行到某个阶段的时候，帮你做一些事情，类似于生命周期的概念 扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。 作用于整个构建过程

  常用plugins

  ```javascript
  html-webpack-plugin // 会在打包结束后，自动生成一个html文件，并把打包生成的js模块引入到该html 中。
  clean-webpack-plugin // 删除打包文件
  ```
  更多第三方插件，请查看 [awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins) 列表
  
