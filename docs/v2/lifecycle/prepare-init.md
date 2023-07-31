# new Vue 之前的准备阶段

Vue 初始化阶段会对自身的构造函数很多属性方法。这些方法为 Vue 实例挂载、DOM 挂载、事件注入等提供了方法。

platform 目录下的 web 是 rollup 打包入口的文件。给 Vue 提供了挂载 DOM 的方法。

entry-runtime-with-compiler.js

```js
import Vue from "./runtime/index.js";

const idToTemplate = (id) => {
  const el = document.querySelector(id);
  return el && el.innerHTML;
};
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

export default Vue;
```

platform 目录下的 runtime.js 为 Vue 提供了挂载组件的方法，entry-runtime-with-compiler 缓存了 mount 组件挂载方法。真正挂载 DOM 还是调用 mountComponent

runtime.js

```js
import Vue from "../../../core/index";
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? document.querySelector(el) : undefined;
  return mountComponent(this, el, hydrating);
};
export default Vue;
```

\$mount 挂载之前判断是否有 render 方法，如果有 render 则直接挂载 组件，没有则需要根据 template 生成 render 函数 到 options 之上

## initMixin

initMix 方法为 Vue 实例提供了初始化方法,this.\_init

initMixin 在 core/intance/init.js

```js
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {};
}
```

## stateMixin

stateMixin 为 Vue 初始化生命周期的状态，及 Vue 实例上的属性状态，例如:$set、$delete、$props、$data(为空对象)。$watch 监听属性。

initMixin 在 core/intance/stateMixin.js

```js
export function stateMixin(Vue) {
  const dataDef = {};
  dataDef.get = function () {
    return this._data;
  };
  const propsDef = {};
  propsDef.get = function () {
    return this._props;
  };
  Object.defineProperty(Vue.prototype, "$data", dataDef);
  Object.defineProperty(Vue.prototype, "$props", propsDef);
  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;
  Vue.prototype.$watch = function (expOrFn, cb, options) {};
}
```

## eventMixin

为 Vue 添加事件订阅，与发布订阅模式一样

```js
export function eventsMixin(Vue) {
  const hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {};

  Vue.prototype.$once = function (event, fn) {};

  Vue.prototype.$off = function (event, fn) {};

  Vue.prototype.$emit = function (event) {};
}
```

## lifecyleMixin

为 Vue 实例添加关于更新视图、数据、销毁组件的方法

```js
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode, hydrating) {};

  Vue.prototype.$forceUpdate = function () {};

  Vue.prototype.$destroy = function () {};
}
```

## renderMixin

给 Vue 实例添加 render 方法与$nextTick 方法。\_render 方法用来生产虚拟 DOM

```js
export function renderMixin(Vue) {
  // install runtime convenience helpers
  // 为Vue示例渲染虚拟DOM及绑定属性的和事件的方法
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;
    vm.$vnode = _parentVnode;
    let vnode;
    try {
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode;
  };
}
```

## 总结

上述方法 initMixin 为 Vue 提供了\_init 初始化方法，stateMixin 提供了对数据响应式的直接操作方法$set、$delete、$watch 反复噶。eventMixin 提供了发布订阅模式。lifecyleMixin 提供了组件渲染成虚拟DOM的render方法还有$nextTick 异步操作方法。
