import{_ as e,o as i,c as s,d as n}from"./app-bac77e8c.js";const a={},r=n(`<h1 id="vue-js-源码目录设计" tabindex="-1"><a class="header-anchor" href="#vue-js-源码目录设计" aria-hidden="true">#</a> Vue.js 源码目录设计</h1><p>Vue 的源码目录结构如下，核心代码都在 src 的目录下。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>├── dist
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



</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="compiler" tabindex="-1"><a class="header-anchor" href="#compiler" aria-hidden="true">#</a> Compiler</h2><p>compiler 目录中包含 Vue 相关的编译的代码，包过把模块解析成 ast 语法树，ast 语法树优化，代码生产等功能。</p><p>编译的工作可以在构建时(借助 webpack.vue-loader 等复制插件);也可以在运行时，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。</p><h2 id="core" tabindex="-1"><a class="header-anchor" href="#core" aria-hidden="true">#</a> Core</h2><p>core 目录包含 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等。</p><h2 id="platform" tabindex="-1"><a class="header-anchor" href="#platform" aria-hidden="true">#</a> platform</h2><p>Vue.js 是一个跨平台的 MVVM 框架, 它可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入库，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js</p><h2 id="server" tabindex="-1"><a class="header-anchor" href="#server" aria-hidden="true">#</a> server</h2><p>vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。</p><p>服务端的渲染主要的工作是吧组件渲染为服务端的 HTML 自读穿，将他们直接发送到浏览器，最后将静态标记“混合”为呵护短上完成交互的响应程序</p><h2 id="sfc" tabindex="-1"><a class="header-anchor" href="#sfc" aria-hidden="true">#</a> sfc</h2><p>通常开发 Vue.js 会借助 webpack 构建，然后通过.vue 单文件来编写组件。 这个目录下的代码逻辑会把.vue 文件内容解析成一个 JavaScript 对象。</p><h2 id="shared" tabindex="-1"><a class="header-anchor" href="#shared" aria-hidden="true">#</a> shared</h2><p>Vue.js 定义一些工具方法，这里定义的文件会被 web 端的 vue.js 和服务端 vue.js 共享。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>从 Vue.js 的目录可以看出来，vue 的功能模块拆分的非常清楚，相关逻辑放在一个独立的目录下维护，并且把复用的代码也抽成了一个独立的目录</p>`,19),d=[r];function l(c,v){return i(),s("div",null,d)}const t=e(a,[["render",l],["__file","directory.html.vue"]]);export{t as default};
