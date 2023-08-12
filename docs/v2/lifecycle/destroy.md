# 销毁阶段

生命周期的最后一个阶段就是销毁阶段。当调用了$destroy 方法之时开始进行销毁
![](https://vue-js.com/learn-vue/assets/img/7.810540a5.png)

## 开始销毁

```js
Vue.prototype.$destroy = function () {
  const vm = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, "beforeDestroy");
  vm._isBeingDestroyed = true;
  // remove self from parent
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm);
  }
  // teardown watchers
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  let i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  // remove reference from data ob
  // frozen object may not have observer.
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--;
  }
  // call the last hook...
  vm._isDestroyed = true;
  // invoke destroy hooks on current rendered tree
  vm.__patch__(vm._vnode, null);
  // fire destroyed hook
  callHook(vm, "destroyed");
  // turn off all instance listeners.
  vm.$off();
  // remove __vue__ reference
  if (vm.$el) {
    vm.$el.__vue__ = null;
  }
  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};
```

销毁之前调用了实例当前的 beforeDestroy,然后拿到当前实例的父组件开始对每个子元素进行卸载，对当前 watchers 中的每个 watcher 进行进行卸载操作，用 patch 方法传入最近的 DOM 为 null 则会把之前的 DOM 都进行下载，调用销毁完成方法，销毁当前 vm 实例上绑定的所有事件，把当前虚拟节点的父节点置为 null。销毁彻底结束。

```js
const vm: Component = this;
if (vm._isBeingDestroyed) {
  return;
}
```

如果当前组件\_isBeingDestroyed 为 true 则表示已经销毁过。直接 return

## 销毁中

```js
callHook(vm, "beforeDestroy");
```

触发 beforeDestroy 销毁之前的函数。

接下来进行真正的销毁

```js
const parent = vm.$parent;
if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
  remove(parent.$children, vm);
}
```

如果当前的父组件不是 abstract 也就是 keep-alive 之类的组件而且父组件没有被销毁，把当前实例从父组件中移除掉。

```js
// teardown watchers
if (vm._watcher) {
  vm._watcher.teardown();
}
let i = vm._watchers.length;
while (i--) {
  vm._watchers[i].teardown();
}
```

vm.\_watcher.teardown();会移除自身依赖的数据的删除，teardown 是将自身 deps 中依赖的自己移除。每次 new Watcher 时会把当前 this.\_watchers.push(this)所有实例内的数据对其他数据的依赖都会存放在实例的\_watchers 属性中,所以需要卸载掉这个依赖 vm.\_watchers[i].teardown();

```js
if (vm._data.__ob__) {
  vm._data.__ob__.vmCount--;
}
```

从数据中删除引用 ,冻结对象可能没有观察者。

## 销毁结束

```js
vm._isDestroyed = true;
// invoke destroy hooks on current rendered tree
vm.__patch__(vm._vnode, null);
callHook(vm, "destroyed");
// turn off all instance listeners.
vm.$off();
// remove __vue__ reference
if (vm.$el) {
  vm.$el.__vue__ = null;
}
// release circular reference (#6759)
if (vm.$vnode) {
  vm.$vnode.parent = null;
}
```

当把 vnode 完全卸载完成之后，调用实例 destroyed 生命周期 方法，vm.$off()，卸载实例所有的事件监听。把当前vm.$node.parent 设置为 null。意味着销毁阶段结束了。

## 总结

销毁之前调用了实例当前的 beforeDestroy,然后拿到当前实例的父组件开始对每个子元素进行卸载，自身的 watcher 进行了卸载和 watchers 中的每个 watcher 进行进行卸载操作，用 patch 方法传入最近的 DOM 为 null 则会把之前的 DOM 都进行卸载，调用销毁完成方法，销毁当前 vm 实例上绑定的所有事件，把当前虚拟节点的父节点置为 null。销毁彻底结束。
