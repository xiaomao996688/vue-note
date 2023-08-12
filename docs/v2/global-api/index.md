# 全局 api

全局 API 的初始化的方法是在 core/index.js 中完成的。

```js
import Vue from "./instance/index";
import { initGlobalAPI } from "./global-api/index";
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering,
});

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  },
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext,
});

Vue.version = "__VERSION__";

export default Vue;
```

## initGlobalAPI(Vue);

```js
export function initGlobalAPI(Vue) {
  // config
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = (obj) => {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}
```

## initUse

插件要在 Vue 上挂载时，必须使用 Vue.use(router)。router 就是要挂载的插件实例。use 是 Vue 的静态方法。

```js
export function initUse(Vue) {
  Vue.use = function (plugin) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    const args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}
```

use 方法接收一个参数是插件, Vue.use = function (){} 。所以当前的 this 就是这个 Vue 这个类。首先拿到\_installedPlugins 查看插件是否注册过。

```js
if (installedPlugins.indexOf(plugin) > -1) {
  return this;
}
```

如果注册过则直接返回 Vue。

```js
// additional parameters
const args = toArray(arguments, 1);
args.unshift(this);
```

toArray(arguments, 1)。从下表 1 开始把 arguments 转成数组。给数组之中的第一个参数传入 Vue

```js
if (typeof plugin.install === "function") {
  plugin.install.apply(plugin, args);
} else if (typeof plugin === "function") {
  plugin.apply(null, args);
}
installedPlugins.push(plugin);
return this;
```

如果实例上面有 install 方法，调用插件的 install 方法并把当前插件作为 this， args 作为参数。installedPlugins 推入这个插件。返回当前 Vue。
说明这个插件已经安装过了。

## 插件 demo

```js
class VueRouter {
  constructor() {}
  install(Vue, args) {}
}
```
