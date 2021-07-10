## 项目准备

### 初始化

```bash
# 初始化 npm 配置文件
npm init -y 
# 安装核心库和命令行工具
npm install webpack@4.44.0 webpack-cli@3.3.12 --save-dev 

```



### .npmrc

在为了解决npm龟速下载的糟糕体验时，我们一般会将npm源设置为淘宝镜像源

```bash
npm config set registry https://registry.npm.taobao.org
```

但是大家想想，万一某个同学克隆了你的项目之后，准备在他本地开发的时候，并没有设置淘宝镜像 源，又要人家去手动设置一遍，我们作为项目的发起者，就先给别人省下这份时间吧，只需要在根目录 添加一个 .npmrc 并做简单的配置即可:

```bash
# 根目录下创建 .npmrc 文件
touch .npmrc

# 在该文件内输入配置
registry=https://registry.npm.taobao.org/

```



### 创建webpack配置文件

```javascript
# webpack.config.js
const path = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist')
  },
  mode: 'development'
}
```



### 样式处理

#### 集成 css 样式处理

- 安装 (style-loader 需要安装2.x版本）

```bash
npm install css-loader style-loader@2 --save-dev
```

- 配置

```javascript
# webpack.config.js
const path = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

#### 集成 less / sass

- 安装 sass 和 less 相关模块( less-loader 安装7.x版本，sass-loader 安装10.x版本)

  ```bash
  #less
  npm install less less-loader@7 --save-dev
  
  #sass
  npm install node-sass sass-loader@10 --save-dev
  ```

- 配置

  ```javascript
  # webpack.config.js
  const path = require('path')
  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist')
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test:/\.less$/,
          use: ["style-loader", "css-loader", "less-loader"]
        },
        {
          test:/\.scss/,
          use: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    }
  }
  ```

  

#### 集成 postcss

Github:https://github.com/postcss/postcss

***postcss之于css 相当于babel之于js***

postcss主要功能只有两个:

1. 把css解析成JS可以操作的抽象语法树AST，

2. 第二就是调用插 件来处理AST并得到结果;

所以postcss	一般都是通过插件来处理css，并不会直接处理 比如：autoprefixer（自动补⻬浏览器前缀）  cssnano（css压缩）



- 安装（postcss-loader 需要安装6.x版本）

  ```bash
  npm install postcss-loader@6 autoprefixer cssnano --save-dev
  ```

- 配置`postcss.config.js`

  ```javascript
  # postcss.config.js
  module.exports = {
    plugins: [require('autoprefixer'), require('cssnano')]
  }
  ```

- 配置浏览器兼容版本

  ```javascript
  # 配置package.json
  "browserslist":["last 2 versions", "> 1%"],
    
  # 或者直接在postcss.config.js里配置 module.exports = {
    plugins: [
      require("autoprefixer")({
        overrideBrowserslist: ["last 2 versions", "> 1%"],
      }),
  ], };
  
  # 或者创建.browserslistrc文件 
  > 1%
  last 2 versions
  not ie <= 8
   
  ```

- 配置`webpack.config.js`

  ```javascript
  # webpack.config.js
  const path = require('path')
  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist')
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test:/\.less$/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
          test:/\.scss/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        }
      ]
    }
  }
  ```

  

#### 样式分离

经过如上几个loader处理，css最终是打包在js中的，运行时会动态插入head中，但是我们一般在生产环 境会把css文件分离出来(有利于用户端缓存、并行加载及减小js包的大小)，这时候就用到 [mini-css- extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 插件。

- 安装(需要安装1.x版本)

  ```bash
  npm install mini-css-extract-plugin@1 -D
  ```

- 使用

  ```javascript
  # webpack.config.js
  const path = require('path');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist')
    },
    mode: 'development',
    module: {
      rules: [
        // MiniCssExtractPlugin 需要参与模块解析，须在此设置此项，不再需要style-loader
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
          test:/\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader, 'postcss-loader']
        },
        {
          test:/\.scss/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        }
      ]
    },
    plugins: [new MiniCssExtractPlugin({
      filename: [name].css,
      ...
    })]
  }
  ```

  

### 图片 / 字体文件处理

`url-loader` 和 `file-loader` 都可以用来处理本地的资源文件，如图片、字体、音视频等。功能也是 类似的， 不过`url-loader` 可以指定在文件大小小于指定的限制时，返回 DataURL ，不会输出真实的 文件，可以减少昂贵的网络请求。

- 安装（使用url-loader 必须要 安装 file-loader）

  ```bash
  npm install url-loader file-loader --save-dev
  ```

- 使用

  ```javascript
  # webpack.config.js
  const path = require('path');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist')
    },
    mode: 'development',
    module: {
      rules: [
        // MiniCssExtractPlugin 需要参与模块解析，须在此设置此项，不再需要style-loader
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
          test:/\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader, 'postcss-loader']
        },
        {
          test:/\.scss/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
  				test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
          use: [
            {
              // 仅配置 url-loader 就行，内部会自动调用 file-loader
              loader: 'url-loader', 
              options: {
                limit: 10240,
                name: '[name]_[hash:6].[ext]',
                outputPath: 'assets' // 设置资源输出目录
              }
            }
          ]
        }
      ]
    },
    plugins: [new MiniCssExtractPlugin({
      filename: [name].css,
      ...
    })]
  }
  ```

  **注意:**

  limit的设置要设置合理，太大会导致JS文件加载变慢，需要兼顾加载速度和网络请求次数。 如果需要使用图片压缩功能，可以使用 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)

  

  **webpack文件指纹策略:**

  - hash策略 是以项目为单位的，项目内容改变，则会生成新的hash,内容不变则hash不变 
  - chunkhash 以chunk为单位，当一个文件内容改变，则整个chunk组的模块hash都会改变 
  - contenthash 以自身内容为单位

  

### HMTL 页面处理

[htmlwebpackplugin](https://github.com/jantimon/html-webpack-plugin)会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 模块引入到该 html 中。

- 安装

  ```bash
  npm i html-webpack-plugin@4 --save-dev
  ```

- 参数列表

  ```javascript
   
  title: 用来生成⻚面的 title 元素
  filename: 输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
  template: 模板文件路径，支持加载器，比如 html!./index.html
  inject: true | 'head' | 'body' | false ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
  favicon: 添加特定的 favicon 路径到输出的 HTML 文件中。
  minify: {} | false , 传递 html-minifier 选项给 minify 输出
  hash: true | false, 如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用。
  cache: true | false，如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件。 showErrors: true | false, 如果为 true, 这是默认值，错误信息会写入到 HTML ⻚面中 chunks: 允许只添加某些块 (比如，仅仅 unit test 块)
  chunksSortMode: 允许控制块在添加到⻚面之前的排序方式，支持的值:'none' | 'default' | {function}-default:'auto'
  excludeChunks: 允许跳过某些块，(比如，跳过单元测试的块)
   
  ```

- 配置

  ```javascript
  # webpack.config.js 
  const path = require("path");
  const htmlWebpackPlugin = require("html-webpack-plugin");
  module.exports = {
   ...
    plugins: [
      new htmlWebpackPlugin({
        title: "My App",
        filename: "app.html",
        template: "./src/index.html"
  }) ]
  };
  ```

### 打包文件清理

[clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)这个插件是用来帮我们清除打包之后 dist 目录下的其他多余或者无用的代码，因为我们之前可能生成过其他的代码，如果不清楚的话可能多个代码掺杂在一起容易把我们搞混乱了`clean-webpack-plugin` 插件 就是这样由来的。每次生成代码之前先将 dist 目录清空

- 安装

  ```bash
  npm install clean-webpack-plugin --save-dev
  ```

- 使用

  ```javascript
  # webpack.config.js 
  const path = require("path");
  const htmlWebpackPlugin = require("html-webpack-plugin");
  const const { CleanWebpackPlugin } = require("clean-webpack-plugin")
  module.exports = {
   ...
    plugins: [
      new htmlWebpackPlugin({
        title: "My App",
        filename: "app.html",
        template: "./src/index.html"
  		}),
      new CleanWebpackPlugin({})
    ]
  };
  ```

  **Q：clean-webpack-plugin:如何做到dist目录下某个文件或目录不被清空？**

  A：使用配置 项:cleanOnceBeforeBuildPatterns 案例:cleanOnceBeforeBuildPatterns: ["**/\*", "!dll", "!dll/**"], !感 叹号相当于exclude 排除，意思是清空操作排除dll目录，和dll目录下所有文件。 注意:数组列表里的 “**/*”是默认值，不可忽略，否则不做清空操作。



### sourceMap

源代码与打包后的代码的映射关系，通过`sourceMap`定位到源代码。 在dev模式中，默认开启，关闭的话 可以在配置文件里配置`devtool:"none"`

devtool的介绍:https://webpack.js.org/configuration/devtool#devtool

- eval：速度最快,使用`eval`包裹模块代码,
- source-map：产生 `.map` 文件
- cheap：较快，不包含列信息
- Module：第三方模块，包含 `loader` 的 sourcemap (比如`jsx to js` ，`babel` 的 sourcemap) 
- inline: 将` .map `作为DataURI嵌入，不单独生成 `.map `文件

配置推荐

```javascript
 devtool:"cheap-module-eval-source-map",// 开发环境配置
//线上不推荐开启
devtool:"cheap-module-source-map", // 线上生成配置
 
```



### 配置开发服务器

每次改完代码都需要重新打包一次，打开浏览器，刷新一次，很麻烦，我们可以安装使用 [webpackdevserver](https://webpack.docschina.org/configuration/dev-server/)来改善这块的体验

- 安装

  ```bash
  npm install webpack-dev-server@3.11.0 --save-dev
  ```

- 配置

  - package.json

  ```json
  
  {
    ...
    "script": {
      ...
      "server": "webpack-dev-server"
    }
  }
  ```

  - Web pack.config.js

  ```javascript
  # webpack.config.js
  const path = require('path');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const htmlWebpackPlugin = require("html-webpack-plugin");
  const const { CleanWebpackPlugin } = require("clean-webpack-plugin")
  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist')
    },
    mode: 'development',
    devServer: {
      contentBase: "./dist",
      open: true,
      port: 8080
    }
    module: {
      rules: [
        // MiniCssExtractPlugin 需要参与模块解析，须在此设置此项，不再需要style-loader
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
          test:/\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader, 'postcss-loader']
        },
        {
          test:/\.scss/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
  				test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
          use: [
            {
              // 仅配置 url-loader 就行，内部会自动调用 file-loader
              loader: 'url-loader', 
              options: {
                limit: 10240,
                name: '[name]_[hash:6].[ext]',
                outputPath: 'assets' // 设置资源输出目录
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: [name].css,
        ...
    	}),
      new htmlWebpackPlugin({
        title: "My App",
        filename: "app.html",
        template: "./src/index.html"
  		}),
      new CleanWebpackPlugin({})
    ]
  }
  ```

  - 启动

    ```bash
    npm run serve
    ```

    启动服务后，会发现dist目录没有了，这是因为devServer把打包后的模块不会放在dist目录下，而是放 到内存中，从而提升速度



### 解决跨域

联调期间，前后端分离，直接获取数据会跨域，上线后我们使用nginx转发，开发期间，webpack就可以搞定这件事

启动一个服务器，mock一个接口`npm i express -D`

```javascript
// 创建一个server.js 修改scripts "server":"node server.js"
# server.js
const express = require('express')
const app = express()
app.get('/api/info', (req,res)=>{
  res.json({
    name:'Timokie',
    age:18, 
    msg:'hello, Timokie!'
  }) 
})
app.listen('9092')
// node server.js
// http://localhost:9092/api/info
```

项目中安装axios工具`npm i axios -D`

```javascript
# index.js
import axios from 'axios'
axios.get('http://localhost:9092/api/info').then(res=>{
    console.log(res)
})
```

产生跨域问题，此时我们可以修改 `webpack.config.js` 来设置服务器代理

```javascript
module.exports={
  ...
	proxy: {
    "/api": {
      target: "http://localhost:9092"
    }
	}
}
```

修改`index.js`请求路径

```javascript
 axios.get("/api/info").then(res => {
  console.log(res);
});
```



### 模块热替换

[Hot Module Replacement](https://webpack.docschina.org/concepts/hot-module-replacement/)（**HMR:**模块热替换）

模块热替换(HMR - hot module replacement)功能会在应用程序运行过程中，替换、添加或删除 [模块](https://webpack.docschina.org/concepts/modules/)，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面期间丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

**启动hmr**

```javascript
# webpack.config.js
module.exports = {
  ...
 
  devServer: {
    contentBase: "./dist",
    open: true,
    hot:true, //即便HMR不生效，浏览器也不自动刷新，就开启hotOnly hotOnly:true
  },
  
  ...
}
```

**配置文件头部引入webpack**

```javascript
# webpack.config.js
//const path = require("path");
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const HtmlWebpackPlugin = require("html-webpack-plugin");
//const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
```

**在插件配置处添加:**

```javascript
# webpack.config.js
module.exports = {
  ...,
   
	plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
}
```



**案例**

- 处理 css 模块 HMR

  ```javascript
   
  # index.js
  import "./css/index.css";
  var btn = document.createElement("button"); 
  btn.innerHTML = "新增"; 
  document.body.appendChild(btn);
  btn.onclick = function() {
    var div = document.createElement("div");
    div.innerHTML = "item";
    document.body.appendChild(div);
  };
  
  # index.css
  div:nth-of-type(odd) {
    background: yellow;
  }
  ```

  

- 处理 js 模块 HMR

  **需要使用`module.hot.accept`来观察模块变更从而更新**

  ```javascript
  # counter.js
  function counter() {
    var div = document.createElement("div");
    div.setAttribute("id", "counter");
    div.innerHTML = 1;
    div.onclick = function() {
      div.innerHTML = parseInt(div.innerHTML, 10) + 1;
    };
    document.body.appendChild(div);
  }
  export default counter;
  
  
  # number.js
  function number() {
    var div = document.createElement("div");
    div.setAttribute("id", "number");
    div.innerHTML = 13000;
    document.body.appendChild(div);
  }
  export default number;
  
  
  # index.js
  import counter from "./counter";
  import number from "./number";
  counter();
  number();
  if (module.hot) {
    module.hot.accept("./b", function() {
      document.body.removeChild(document.getElementById("number"));
      number();
    });
  }
  ```

  

### 集成 Babel 处理 ES6

官方网站：https://babeljs.io/

中文网站：https://www.babeljs.cn/ 

Babel是 JavaScript 编译器，能将 ES6 代码转换成 ES5 代码，让我们开发过程中放心使用JS新特性而不用担心兼容性问题，并且还可以通过插件机制根据需求灵活的扩展。 

Babel在执行编译的过程中，会从项目根目录下的`.babelrc` 的 JSON 文件中读取配置。没有该文件会从 loader 的 options 地方读取配置。

- 安装 babel

  ```bash
  npm install @babel/core @babel/preset --save-dev
  ```

  `babel-loader`是 webpack 与 babel 的通信桥梁，不会做把es6转成es5的工作，这部分工作需要用到`@babel/preset-env`来做

  - es6+ ----->babel(presets-env)-----> es5 

  - flow语法 ---->babel(presets-flow)->es5

  - jsx语法 ---->babel(preset-react) ->es5 

  - ts语法 ---->babel(preset-ts) -->es5

- 配置 webpack.config.js

  ```javascript
  # webpack.config.js
  module.exports = {
    ...
    module: {
      rules: [  
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
         }}
       ]
     }
  }
  ```

  通过上面的几步 还不够，默认的 Babel 只支持 let 等一些基础的特性转换，Promise 等一些还有转换过 来，这时候需要借助`@babel/polyfill`，把 es 的新特性都装进来，来弥补低版本浏览器中缺失的特性

- 安装生产依赖 @babel/polyfill

  ```bash
  # 注意： @babel/polyfill 是生产依赖
  npm install @babel-polyfill --save
  ```

- 修改入口文件，在顶部注入 polyfill

  ```javascript
  # index.js
  import "@babel/polyfill"
  ```

执行打包命令后，会发现打包的体积大了很多，这是因为polyfill默认会把所有特性注入进来，假如我想我用到的es6+，才 会注入，没用到的不注入，从而减少打包的体积，就需要配置按需加载，减少冗余

```javascript
# webpack.config.js
# webpack.config.js
module.exports = {
  ...
  module: {
    rules: [  
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      edge: "17",
                      firefox: "60",
                      chrome: "67",
                      safari: "11.1",
                    },
                    //新版本需要指定核心库版本
                    corejs: 2,
                    useBuiltIns: "entry",
                  },
                ],
              ],
            },
          },
        ],
      },
     ]
   }
}
```

`useBuiltIns` 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置 @babel/polyfill 。 

它有三 个参数可以使用: 

- entry：需要在 webpack 的入口文件里 `import "@babel/polyfill" `一次。 babel 会根据你的使用情况导入垫片，没有使用的功能不会被导入相应的垫片。 
- usage：不需要 import ，全 自动检测，但是要安装 @babel/polyfill 。 
- false：如果你 `import "@babel/polyfill"` ，它不会排 除掉没有使用的垫片，程序体积会庞大。(不推荐)



扩展:
 babelrc文件: 新建.babelrc文件，把options部分移入到该文件中，就可以了

```javascript
 
#.babelrc
 {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        //新版本需要指定核心库版本
        corejs: 2,
        useBuiltIns: "entry",
      },
    ],
  ],
},
```


