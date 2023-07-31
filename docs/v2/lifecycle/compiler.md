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
