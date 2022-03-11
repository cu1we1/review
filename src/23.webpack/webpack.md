## 1.开发环境和生产环境的定义

webpack 对开发和生产环境的定义很清楚。

webpack 在配置对象中提供了一个 mode 参数

mode:production/development 两个结果

production:代表生产环境，当配置为此结果时，webpack 会对所有的 js 和 html 进行压缩处理，并且将构建结果输出到指定文件结构。用于发布到生产服务器

development：代表开发环境，当配置为此结果时，webpack 要配合 webpack-dev-server 插件来使用，此时会启动本地服务器，用来调试和开发前端项目的代码，还需要配合 devtools 来实现编译代码和开发代码的映射来保证调试的准确性

## 2.webpack 搭建开发和生产环境

### 2.1 创建一个生产和开发环境分开的结构

```sh
npm init -y
npm i webpack -D
npm i webpack-cli -D
```

三个文件

1. webpack.base.js
2. webpack.dev.js
3. webpack.prod.js

两个文件

1. public/index.html
2. src/main.js

### 2.2 配置 entry 和 output

```sh
npm i html-webpack-plugin -D
```

- 1.为 HTML 文件中引入外部资源如 script、link 等，动态添加每次 compile 后的 hash，防止引用缓存的外部文件问题。
- 2.可以生成创建 HTML 入口文件，配置 N 个 html-webpack-plugin 可以生成 N 个页面入口。

webpack.base.js

```js
const path = require("path");
//html处理插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "" //publicPath是生成的dist中的html文件中自动引入js和css文件时在最前面拼的一部分字符串
  },
  plugins: [
    //html处理插件
    new HtmlWebpackPlugin({
      template: "./public/index.html", //html模版文件位置
      filename: "index.html", //生成的html文件名，生成的html文件路径会整合base中配置的path生成到目标位置
      chunks: ["index"] //生成的index.html中自动引入的组件，这里设置的是entry中定义的key
    })
  ]
};
```

### 2.3 配置 dev 环境的基本配置

```sh
npm i webpack-merge -D
```

安装成功之后我们将 webpack.dev.js 文件做如下改造

```js
//webpack.dev.js
//引入webpack-merge用来合并配置到webpack.base.js中
const { merge } = require("webpack-merge");
//引入webpack.base.js
const base = require("./webpack.base.js");
const path = require("path");

//merge用法用来将配置内容合并到webpack.base.js中
//第一个参数是原始的webpack的配置json对象
//第二个参数是我们要合并的单独的配置对象
module.exports = merge(base, {
  //定义环境为开发环境
  mode: "development",
  //配置本地服务
  devServer: {
    //配置本地的静态资源文件夹，用来让这两个文件夹内部的文件可以通过访问http地址直接展示
    static: [
      path.resolve(__dirname, "dist"), //这里是构建目标路径
      path.resolve(__dirname, "public") //这里是public部分的内容
    ],
    host: "localhost", //本地服务启动后的ip地址
    port: 8080, //本地服务启动的端口号
    open: true //启动时自动打开默认浏览器
  }
});
```

package.json 中定义启动命令.

```sh
"serve":"webpack serve --config webpack.dev.js --color --progress --hot"
```

启动本地服务

```sh
npm run dev
```

### 2.4 配置 prod 环境

配置 prod 环境我们需要改造 webpack.prod.js 文件的内容如下

```js
//webpack.prod.js
const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");
//清理dist文件夹的插件，用来在每次执行构建的时候清空上次构建的结果防止文件缓存
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = merge(base, {
  //定义环境为生产环境
  mode: "production",
  plugins: [new CleanWebpackPlugin()]
});
```

所以这里我们需要安装一下 clean-webpack-plugin

```sh
npm i clean-webpack-plugin -D
```

然后我们需要在 package.json 中添加构建指令

```js
"build": "webpack --config webpack.prod.js --color --progress"
```

添加完毕后我们执行

```sh
npm run build
```

### 2.5 配置 babel

需要安装 babel-loader

```sh
npm i babel-loader -D
```

然后我们需要安装 babel 的核心库@babel/core,@babel/preset-env,core-js

```sh
// @babel/core 这个包里主要都是一些去对代码进行转换的核心方法，把js分析转换成ast，方便其他插件处理。
// babel/preset-env 是一个智能预设，配置了它就可以让你用es6+去书写你的代码，而且他会按需去加载所需要的插件
// core-js  是JavaScript标准库的 polyfill（垫片/补丁），处理新的API
npm i @babel/core @babel/preset-env -D
npm i core-js -s
```

然后我们需要在 webpack.base.js 中配置 babel-loader

这里配置在 base 中是因为无论生产环境还是开发环境都需要对 js 进行解析并且编译

```js
//webpack.base.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: ""
  },
  module: {
    rules: [
      {
        //配置babel-loader用来编译和解析js
        test: /\.js$/,
        use: { loader: "babel-loader" }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      chunks: ["index"]
    })
  ]
};
```

这一步操作完毕之后我们还需要在项目中创建 babel 的核心配置文件

.babelrc 文件

```json
{
  "presets": [
    [
      "@babel/preset-env", //应用@babel/preset-env解析js
      {
        "useBuiltIns": "usage", //使用动态解析语法，根据兼容性转义
        "corejs": 3 //使用core-js3版本的js库来对低版本浏览器做兼容
      }
    ]
  ]
}
```

然后我们需要定义该项目可以兼容浏览器的范围

创建.browserslistrc 文件（webpack5 版本配置 browserslist 之后会造成热更新失效的问题，有待官方解决）

```sh
> 0.25%
last 2 versions
```

```sh
npx browserslist
```

来查看当前项目可兼容浏览器的列表

browserlist 配置说明

| 例子                       | 说明                                                    |
| :------------------------- | :------------------------------------------------------ |
| > 1%                       | 全球超过 1%人使用的浏览器                               |
| > 5% in US                 | 指定国家使用率覆盖                                      |
| last 2 versions            | 所有浏览器兼容到最后两个版本根据 CanIUse.com 追踪的版本 |
| Firefox ESR                | 火狐最新版本                                            |
| Firefox > 20               | 指定浏览器的版本范围                                    |
| not ie <=8                 | 方向排除部分版本                                        |
| Firefox 12.1               | 指定浏览器的兼容到指定版本                              |
| unreleased versions        | 所有浏览器的 beta 测试版本                              |
| unreleased Chrome versions | 指定浏览器的测试版本                                    |
| since 2013                 | 2013 年之后发布的所有版本                               |

完成之后我们可以在 index.js 中定义一些 es6 的 map 循环，Promise 等来测试构建是否被转译

### 2.6 样式的处理

```js
style-loader - 把css插入到页面中，style标签
css-loader - 会对 @import 和 url() 进行处理
postcss-loader - 做不同浏览器兼容处理
sass-loader - 处理sass css
```

安装：

```sh
npm i style-loader css-loader postcss-loader sass-loader  sass -D
```

样式的处理和 js 不同，样式在开发和生产环境的要求是不同的，我们在开发环境中由于启动本地服务实时编写代码并且调试，所以不需要将 css 抽取到外部，而是整合到 js 中即可，发布到生产环境时需要将 css 抽取到外部，所以两个处理是有差异的

所以安装成功之后我们首先处理 dev 文件，在 webpack.dev.js 中使用 loader 解析样式文件

```js
const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");
const path = require("path");
module.exports = merge(base, {
  mode: "development",
  devServer: {
    contentBase: [
      path.resolve(__dirname, "dist"),
      path.resolve(__dirname, "public")
    ],
    host: "localhost",
    port: 8080,
    open: true,
    openPage: ""
  },
  module: {
    rules: [
      {
        //用来编译css代码
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" }
        ]
      },
      {
        //用来编译sass代码
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  }
});
```

然后我们需要在项目中定义 postcss 的配置文件，这里需要安装

```sh
//postcss-preset-env - 会将最新的 CSS 语法转换为目标环境的浏览器能够理解的 CSS 语法。
//postcss 作用类似babel
//cssnano 是一个模块化的css压缩器（去除空格，压缩标识符，不必要的样式定义被清除等）
npm i postcss-preset-env postcss cssnano -D
```

然后我们定义 postcss.config.js 文件

```js
//postcss.config.js
module.exports = {
  plugins: {
    "postcss-preset-env": {}, //处理兼容性
    cssnano: {} //压缩样式
  }
};
```

完毕之后我们通过

```sh
npm run dev
```

来启动项目，并且在 src 中创建 index.scss 文件，内容如下

```sass
/*index.scss*/
.test{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.item{
		width: 100px;
		height: 100px;
		background-color: #333;
	}
}
```

然后我们在 public/index.html 中书写如下代码

```html
<!--index.html-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
  </head>
  <body>
    <div class="test">
      <div class="item"></div>
      <div class="item"></div>
    </div>
  </body>
</html>
```

然后在 index.js 中通过 import 引入 index.scss 文件

然后我们查看首页的样式，postcss 是否有生效。

在生产环境中样式不光要做兼容性处理还需要将 css 部分的代码抽取到 css 文件中。

```sh
// mini-css-extract-plugin - 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件
npm i mini-css-extract-plugin -D
```

然后我们需要在 webpack.prod.js 中做如下改造

```js
const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//引入抽取css样式插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = merge(base, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, //抽取css样式文件
          { loader: "css-loader" },
          { loader: "postcss-loader" }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, //抽取css样式文件
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    //配置样式抽取插件，生成的css文件名称为[name],[name]为entry中定义的key
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ]
});
```

然后我们运行

```sh
npm run build
```

### 2.7 处理 source-map

在生产环境中我们需要在 webpack.prod.js 中增加一个属性 devtool

```json
{
  "devtool": "source-map" //独立配置源码映射
}
```

在开发环境中我们需要在 webpack.dev.js 中增加一个同样的 devtool

```json
{
  "devtool": "inline-source-map" //内联配置源码映射
}
```

### 2.8 路径解析处理

```js
//webpack.base.j追加如下代码
module.exports = {
  resolve: {
    //配置免后缀的文件类型
    extensions: [".js", ".jsx", ".vue", ".css", ".less", ".scss"],
    //为全路径配置缩写@
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
};
```

### 2.9 文件处理

在 src 下创建 assets 文件夹，在其中随便放一个图片.

然后我们思考如果在 src 中引用图片并通过 js 动态设置到网页中，我们必须确保图片在浏览器中可以直接访问所以我们先做一个简单的小实验

在 index.html 中创建一个 id 为 img 的 img 标签

然后我们在 index.js 中

```js
document.querySelector("#img").src = assets中的图片路径;
```

查看浏览器中是否能展示图片。

运行结果我们发现在浏览器中无法直接访问 src 中的图片

因为我们在项目运行的时候所有的浏览器可访问到的文件夹只有 dist 和 public

本地服务启动时本地的 dist 没有实体文件只有 public 可以存放静态资源

不过如果我们一定要使用 src 中的图片就需要引用一个新的 loader

```sh
npm i file-loader -D
```

```js
{ //在webpack.base.js中增加file-loader用来解析文件
  test:/\.(png|jpg|jpeg|gif)$/,
    use:[
      {loader:'file-loader'}
    ]
}
```

以上操作完成之后我们在 index.js 中做如下操作

```js
import img from "@/assets/p1.png";
console.log(img);
document.querySelector("#img").src = img;
```

可以直接将他拼在浏览器 localhost:8080/的后面直接访问

file-loader 主要解决的问题就是将 src 中的文件类型的数据动态的追加到 dev-server 的内存中这样在本地的开发环境就可以直接的访问到图片了，并且在打包构建之后通过 import 引入的图片也会构建到生成的 dist 文件夹中。

## 3.安装 Vue 依赖库

```sh
npm i vue@2.6.14 -s
```

改造 public 中的 index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

src 下创建一个 App.vue

```vue
<template>
  <div>app.vue</div>
</template>

<script></script>

<style></style>
```

在 main.js 中做如下改造

```js
//main.js
import Vue from "vue";
import App from "./App.vue";
new Vue({
  render: h => h(App)
}).$mount("#app");
```

然后运行项目，控制台报错

这里需要使用的就是
vue-loader - 将单文件组件解析为 vue runtime 是可识别的组件模块。
vue-template-compiler [vue-template-compiler](https://www.npmjs.com/package/vue-template-compiler)

```sh
npm i vue-loader@15.9.8 -D
```

```sh
npm i vue-template-compiler@2.6.14 -D
```

改造 webpack.base.js 的配置

```js
// webpack.base.js
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
};
```

以上操作完成之后我们来实际运行一下项目

```sh
npm run dev
```

并且打包构建一下

```sh
npm run build
```

发现 vue 文件已经可以解析

到此为止 vue 的处理部分已经完成

## 4.VueRouter 的安装

首先安装 VueRouter

```sh
npm i vue-router@3.5.3
```

然后我们在项目 src 下创建 views 文件夹，并且创建 Index.vue 如下

```vue
<template>
  <div>this is views/Index.vue</div>
</template>

<script>
export default {};
</script>

<style></style>
```

我们在 src 下创建 router 文件夹，并且在 router 文件夹内创建 index.js 文件

```js
import Vue from "vue";
import VueRouter from "vue-router";
import Index from "@/views/Index.vue";
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    component: Index
  },
  {
    path: "/test",
    component: () =>
      import(
        /* webpackChunkName: 'test', webpackPrefetch: true */
        "./views/Test.vue"
      )
  }
];
const router = new VueRouter({
  mode: "hash",
  routes
});
export default router;
```

完毕之后我们在改造 main.js

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
```

完毕之后我们在 src 中创建一个 Test.vue 文件并且初始化为以下内容

```vue
<template>
  <div>this is views/Test.vue</div>
</template>

<script>
export default {};
</script>

<style></style>
```

我们需要改造 App.vue 让路由能正确的加载所以

```vue
<template>
  <div>
    {{ str }}
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      str: "hello App"
    };
  }
};
</script>

<style></style>
```

然后我们启动查看页面，是否正常访问

之后我们运行

```sh
npm run build
```

查看 dist 目录会发现多生成一个 test.bundle.js

这么做有一个非常大的好处就是当我们项目的页面非常多的时候可以通过异步引入的方式将路由按照自定义的 webpackChunkName 将他们单独拆分成多个包，这样打包后的 js 文件就不会将所有的源代码都放到一个 main.bundle.js 中所以这么做可以实现 vue 项目的首屏幕加载速度的优化。

---

完毕之后我们在 index 中通过 router-link 跳转到 Test.vue

我们接下来在 Test.vue 中定义一些样式

```vue
<template>
  <div class="test">Test</div>
</template>

<script></script>

<style lang="scss">
.test {
  display: flex;
  color: red;
}
</style>
```

然后我们运行

```sh
npm run build
```

来进行构建以下项目，先运行 index.html 看一下效果。然后我们看一下构建出来的文件结构。这里的 test.bundle 就是 Test.vue 解析出来的代码，并且通过 import（）异步引入的组件我们能够自动拆分到新的文件中，这个就是 webpack 的功能。

### [关于 prefetch](https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules)

## 5.个性化功能

### 5.1 依赖图谱展示

```sh
npm i webpack-bundle-analyzer -D
```

```javascript
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
```

```javascript
plugins: [new BundleAnalyzerPlugin()];
```
