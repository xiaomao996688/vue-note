# 挂载阶段

编译完成之后，接下来就是进入了挂载阶段，创建 vm.$el 来替换 el 。
![](https://vue-js.com/learn-vue/assets/img/4.6a76bb54.png)

## 开始挂载

```js
export function mountComponent(vm, el, hydrating) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== "production") {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== "#") ||
        vm.$options.el ||
        el
      ) {
      } else {
        warn(
          "Failed to mount component: template or render function not defined.",
          vm
        );
      }
    }
  }
  callHook(vm, "beforeMount");

  let updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const vnode = vm._render();
      vm._update(vnode, hydrating);
    };
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}
```

mountComponent 返回当前实例，执行过程会检查当前实例有没有生成 render 方法，如果没有 render 方法则默认一个空的 VNode 节点。准备挂载组件之前调用 callHook(vm, "beforeMount")，创建一个 watcher 传入当前要监听的实例 vm，传入 cb 函数 updateComponent，options 为 noop,isRenderWatcher 为 true。判断挂载时 vnode 是否为空，不为空则调用 callHook(vm, "mounted"),此时挂载已经完成。

```js
export default class Watcher {
  vm;
  expression;
  cb;
  id;
  deep;
  user;
  lazy;
  sync;
  dirty;
  active;
  deps;
  newDeps;
  depIds;
  newDepIds;
  before;
  getter;
  value;
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression =
      process.env.NODE_ENV !== "production" ? expOrFn.toString() : "";
    // parse expression for getter
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
        process.env.NODE_ENV !== "production" &&
          warn(
            `Failed watching path: "${expOrFn}" ` +
              "Watcher only accepts simple dot-delimited paths. " +
              "For full control, use a function instead.",
            vm
          );
      }
    }
    this.value = this.lazy ? undefined : this.get();
  }
```

watcher 的用法。当我们 initWatch(vm, opts.watch)时，会对 watch 上的每个属性进行监听,watch 用法。

```js
watch: {
  firstName: (newV, oldV) {
    if (newV!= oldV) this.cb()
  }
},
methods: {
  cb() {

  }
}

```

```js
const watcher = new Watcher(vm, expOrFn, cb, options);
```

当此初始化之时，会传入当前的实例，还有 key 值，cb 是对应的 firstName 方法或者 handler 方法。

```js
new Watcher(
  vm,
  updateComponent,
  noop,
  {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, "beforeUpdate");
      }
    },
  },
  true /* isRenderWatcher */
);
```

而渲染 watcher 对应的 key 值是一个方法。cb 对应是一个空对象，options 则传入了 before 钩子，第五个参数传入的是否是渲染函数。
如果当前实例是 expOrFn 是一个方法，会把 expOrFn 赋值给 this.getter。我们没有传入 lazy 是 true，则会调用 this.get()。执行 value = this.getter.call(vm, vm)也就是调用了 mountComponent

## 挂载中

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating);
};
```

vm.\_render()返回的是 VNode,调用 vm.\_update 开始 DOM 的更新。update 进行虚拟 DOM 的对比更新。

```js
Vue.prototype._update = function (vnode, hydrating) {
  const vm = this;
  const prevEl = vm.$el;
  const prevVnode = vm._vnode;
  const restoreActiveInstance = setActiveInstance(vm);
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  // 如果是首次渲染调用这个
  if (!prevVnode) {
    // initial render
    // patch会返回最新的Vnode
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // 否则调用 这个， el就变成了虚拟dom
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  restoreActiveInstance();
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null;
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm;
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

update 拿到 vm.$el 作为第一次的 Vnode,作为 oldVnode, vnode 作为 newVnode 调用 patch 方法进行比对，把相应的元素渲染在页面上。

```js
const vm = this;
const prevEl = vm.$el;
const prevVnode = vm._vnode;
const restoreActiveInstance = setActiveInstance(vm);
vm._vnode = vnode;
```

vn.\_render()返回是最新的虚拟 DOM 对象，所以先缓存一份之前 Vnode 为 prevVnode 还有缓存之前的$el 元素。缓存当前的事情。vm.\_vnode 是 render 方法最新生成的 Vnode

## 挂载结束

```js
if (!prevVnode) {
  // initial render
  // patch会返回最新的Vnode
  vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
} else {
  // 否则调用 这个， el就变成了虚拟dom
  // updates
  vm.$el = vm.__patch__(prevVnode, vnode);
}
```

patch 方法会对虚拟 DOM 进行比对，把与之前虚拟 DOM 不同的地方进行更新
如果不存在 prevVnode 说明是第一次渲染，直接拿 vm.$el 进行 patch 比对。

## 总结

Vue 首次渲染是用$el的值开始做为初始的虚拟DOM，第二次渲染的时候会从vm.$el 先缓存 preVnode 和新的 vnode 进行比对，然后进行 patch 新旧 Vnode。
