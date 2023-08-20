# Virtual DOM

虚拟 DOM 就用 JavaScript 对象来描述的 DOM 节点。之前 generate 会把字符串转成函数方法。
createElement 会接受六个参数，分别是当前实例 vm，当前 a(tag),b(data),c(children),d(normalizationType),flase(alwaysNormalize).createElement 内部会对这些参数少传做一个处理，判断当前是否标签有 data，没有 data 则可能是子元素之类等的处理。

```js
_c('div',[_c('h3',[_v(\"hello\")])])
vm.\_c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
```

然后处理过的 tag 和 data 等参数新建一个 vnode 节点。

```js
vnode = new VNode(
  config.parsePlatformTagName(tag),
  data,
  children,
  undefined,
  undefined,
  context
);
```

```js
{
  asyncFactory: "undefined",
  asyncMeta: undefined,
  children: ["..."],
  componentInstance: undefined,
  componentOptions: undefined,
  context: "Vue",
  data: undefined,
  elm: "<div>...</div>",
  fnContext: undefined,
  fnOptions: undefined,
  fnScopeId: undefined,
  isAsyncPlaceholder: false,
  isCloned: false,
  isComment: false,
  isOnce: false,
  isRootInsert: true,
  isStatic: false,
  key: undefined,
  ns: undefined,
  parent: undefined,
  raw: false,
  tag: "div",
  text: "undefined",
};

```

## 虚拟 DOM 的作用

1. 维护视图和状态关系
2. 复杂视图情况下提升渲染性能
3. 跨平台
4. 服务端渲染 DOM
5. 原生渲染 weex/REACT/NATIVE/小程序/uniapp 等

## 总结

因为虚拟 DOM 就是 JavaScript 描述的对象，所以可以通过 Vnode 来生成不同平台对应的标签等从而实现跨平台等作用。
