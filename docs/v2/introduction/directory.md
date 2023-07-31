# Vue.js 源码目录设计

Vue 的源码目录结构如下，核心代码都在 src 的目录下。

```
├── dist
├── examples
├── flow
├── scripts
├── src
│   ├── compiler
│   ├── core
│   │   ├── components
│   │   ├── config.js
│   │   ├── global-api
│   │   ├── instance
│   │   ├── observer
│   │   ├── util
│   │   └── vdom
│   ├── platforms
│   │   ├── web
│   │   └── weex
│   ├── server
│   ├── sfc
│   │   └── parser.js
│   └── shared
│       ├── constants.js
│       └── util.js
├── test
│   ├── helpers
│   ├── ssr
│   ├── unit
│   └── weex



```

## Compiler

compiler 目录中包含 Vue 相关的编译的代码，包过把模块解析成 ast 语法树，ast 语法树优化，代码生产等功能。

编译的工作可以在构建时(借助 webpack.vue-loader 等复制插件);也可以在运行时，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

## Core

core 目录包含 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等。

## platform

Vue.js 是一个跨平台的 MVVM 框架, 它可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入库，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js

## server

vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。

服务端的渲染主要的工作是吧组件渲染为服务端的 HTML 自读穿，将他们直接发送到浏览器，最后将静态标记“混合”为呵护短上完成交互的响应程序

## sfc

通常开发 Vue.js 会借助 webpack 构建，然后通过.vue 单文件来编写组件。
这个目录下的代码逻辑会把.vue 文件内容解析成一个 JavaScript 对象。

## shared

Vue.js 定义一些工具方法，这里定义的文件会被 web 端的 vue.js 和服务端 vue.js 共享。

## 总结

从 Vue.js 的目录可以看出来，vue 的功能模块拆分的非常清楚，相关逻辑放在一个独立的目录下维护，并且把复用的代码也抽成了一个独立的目录
