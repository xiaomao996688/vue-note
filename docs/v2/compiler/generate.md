# generate

generate 需要把 ast 语法树来生成对应的对应的虚拟 DOM。CodegenState 是生成 state 的类，state 则用来存放获取 data，分隔符、警告方法等。

```js
 {
  attrsList: [],
  attrsMap: {},
  children: [
    {
      attrsList: [],
      attrsMap: {},
      children: [{ end: 21, start: 16, static: true, text: "hello", type: 3 }],
      end: 26,
      parent: "",
      plain: true,
      pre: undefined,
      rawAttrsMap: {},
      start: 12,
      static: true,
      staticInFor: false,
      staticRoot: false,
      tag: "h3",
      type: 1,
    },
  ],
  end: 32,
  parent: undefined,
  plain: true,
  rawAttrsMap: {},
  start: 0,
  static: false,
  staticRoot: false,
  tag: "div",
  type: 1,
};

```

genElement 是生成对应的 Vnode 的 code 的字符串`_c('div',[_c('h3',[_v(\"hello\")])])` 最后用 with 把当前 vue 的实例传入进去。

```js
export function generate(ast, options) {
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns,
  };
}
```

## genElement

genStati、genOnce 等方法都是返回 的是字符串。

```js
code = `_c('${el.tag}'${data ? `,${data}` : ""}${
  children ? `,${children}` : "" // children
})`;
```

例如是普通的元素就直接用\_c 然后拼接变量直接返回字符串。再利用 with 传入 this 然后返回当前的代码

```js
export function genElement(el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state);
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state);
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.tag === "template" && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || "void 0";
  } else if (el.tag === "slot") {
    return genSlot(el, state);
  } else {
    // component or element
    let code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      let data;
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state);
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = `_c('${el.tag}'${data ? `,${data}` : ""}${
        children ? `,${children}` : "" // children
      })`;
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code;
  }
}
```

## CodegenState

CodegenState 是给生成一个 state 的实例，给实例挂载各种模块方法等。

```js
CodegenState {
  options;
  warn;
  transforms;
  dataGenFns;
  directives;
  maybeComponent;
  onceId;
  staticRenderFns;
  pre;

  constructor(options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, "transformCode");
    this.dataGenFns = pluckModuleFunction(options.modules, "genData");
    this.directives = extend(extend({}, baseDirectives), options.directives);
    const isReservedTag = options.isReservedTag || no;
    this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag);
    this.onceId = 0;
    this.staticRenderFns = [];
    this.pre = false;
  }
}
```

## createFunction

调用 createFunction 方法把 render 字符串转成函数。

```js
res.render = createFunction(compiled.render);
function createFunction(code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop;
  }
}
```

生了 render 方法之后，目前 render 方法没有传参无法生成对应的虚拟 DOM 节点。用来去生成虚拟 DOM。

```js
vnode = render.call(vm._renderProxy, vm.$createElement);
```

```js
// 编译模版写好的方法
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
```

```js
_c('div',[_c('h3',[_v(\"hello\")])])

```

根据\_c 传递过来的参数开始遍历生成 Vnode 树。最后把 Vnode 返回之后进行 patch。

```js
function createElement(
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType);
}
```

## 总结

编译就是把 template 模版字符串转换成 vnode 的过程。其中 parseHTML 是利用栈的规律把标签转成 ASTNode, 使用 genElement 把 ASTNode 转成字符串 code，通过 createFunction 把 code 转成函数，利用 with 传入 vue 的实例。在\_update 的时候,执行 code 函数，赋值给 vnode，调用 patch 进行 Vnode 的更新。
