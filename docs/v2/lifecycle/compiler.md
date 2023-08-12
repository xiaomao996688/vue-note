# 编译模版阶段

当初始化完成之后当前实例会调用$mount 进行挂载 模版。前面已经看过了调用最终$mount 会调用 mountCompont 来挂载组件。
![](https://vue-js.com/learn-vue/assets/img/3.8d0dc6f5.png)

到了这里只看流程,需要把 template 模版转成 render 函数,render 函数返回的其实就是虚拟 DOM。 编译模版阶段并不存在于 Vue 的所有构件版本中，它只存在于完整版(vue.js)中。在只包含运行时版本(vue.runtime.js)中不存这个阶段，当使用构建工具 webpack、vite，这些构建工具中的 vue-loader，vue-loader 会解析.vue 结尾的文件，并把模版转成 render 函数。所以是不需要 compiler 的。

## 完整版

完整版的 vue.js 是 runtime+ compiler(同时包含运行时和编译模板)。compiler 模块是将 template 模版编译为 render 函数。render 函数返回的则是虚拟 DOM。

```js
new Vue({
  template: `<div>{{msg}}</div>`,
  data() {
    return {
      msg: "hello world",
    };
  },
});
```

```js
{
   tag: 'div',
   {
    attrs: {}
   },
   children:[
    msg
   ]
}
```

生成的 DOM 节点

```html
<div>hello world</div>
```

## 运行时版本

运行时代码不过狂 compiler 的编译 template 文件为 render 函数的方法，所以需要用 render 函数直接来写虚拟 DOM。

```js
new Vue({
  data() {
    return {
      msg: "hello world",
    };
  },
  render(createElement) {
    return createElement(
      "div",
      {
        attrs: {},
        on: {},
      },
      this.msg
    );
  },
});
```

生成的 DOM 节点

```html
<div>hello world</div>
```

## 模版编译分析

platform 目录下的 web 是 rollup 打包入口的文件。给 Vue 提供了挂载 DOM 的方法。

entry-runtime-with-compiler.js 是完整版打包入口文件。

```js
import Vue from "./runtime/index.js";

// 缓存mount方法;
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el, hydrating) {
  el = el && query(el);
  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;
  }
  return mount.call(this, el, hydrating);
};

```

```js
// public mount method
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
```

## 总结

\$mount 挂载时会查看选项 options 中是否有 render 方法，如果有的挂直接调用 mount 方法挂载模版。如果没有 render 方法，则要把 调用 compileToFunction (template, {}, this),把模版和当前实例作为参数，返回 render 方法，和 staticRenderFuns。然后开始挂载模版 mountComponent。
