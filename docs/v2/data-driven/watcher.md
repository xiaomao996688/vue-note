# 观察者的原理

<img :src="$withBase('/assets/data.png')" alt="">
 观察者的作用是用来触发视图重新渲染。

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
  get() {
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`);
      } else {
        throw e;
      }
    } finally {
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }
  addDep(dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    let tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }
  run() {
    if (this.active) {
      const value = this.get();
      if (value !== this.value || isObject(value) || this.deep) {
        // set new value
        const oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(
              e,
              this.vm,
              `callback for watcher "${this.expression}"`
            );
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  }
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }
  teardown() {
    if (this.active) {
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      let i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  }
}
```

```js
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

vm, expOrFn, cb, options, isRenderWatcher,vm 是当前的实例，需要观察的属性或者方法，给 watcher 方法传递的自定义回调，会返回最新只和旧值，options 自定义参数，isRenderWatcher 是否是渲染 watcher。

## 获取当前数据的属性值

```js
this.value = this.lazy ? undefined : this.get();
```

new Watcher 的时候如果是 lazy 是 true 当前的 watcher 的 value 则为 undefined 否则会先调用 get 方法

```js
export function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}
  get() {
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`);
      } else {
        throw e;
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }

```

pushTarget 会把当前的 watcher 作为参数，推入 targetStack，赋值给 Dep.target。此时 Dep.target 是有值的。而且接下来是读取对象上的某个属性值。这时会触发属性的 getter 方法，进行依赖收集。完成后 popTarget 初始化 Dep.target 为 undefined

```js
get: function reactiveGetter() {
  const value = getter ? getter.call(obj) : val;
  if (Dep.target) {
    dep.depend();
    if (childOb) {
      childOb.dep.depend();
      if (Array.isArray(value)) {
        dependArray(value);
      }
    }
  }
  return value;
}
```

Dep.target 现在是有值的，dep.depend()依赖进行收集。

```js
depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

```

Dep.target 就是当前 watcher,添加的 this 则为当前的 dep 类。

```js
let value;
const vm = this.vm;
try {
  value = this.getter.call(vm, vm);
} catch (e) {
  if (this.user) {
    handleError(e, vm, `getter for watcher "${this.expression}"`);
  } else {
    throw e;
  }
} finally {
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
}
return value;
```

缓存当前 vm 的值，获取当前， value = this.getter.call(vm, vm)getter 是一个柯里化的方法，传入 vm 作为参数返回对应的 key 的值。this.deep 是 true,遍历每个属性。popTarget 把 targetStack 出栈把 Dep.target 置为值。

```js
  update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }
```

如果是 lazy 位 true，则 dirty 位 true，如果是同步调用 run 调用的时候会触发对应 key 值的回调 cb 传入新值与旧值。否则调用 queueWatcher 传入 this，对 watcher 进行排序触发

```js
for (index = 0; index < queue.length; index++) {
  watcher = queue[index];
  if (watcher.before) {
    watcher.before();
  }
  id = watcher.id;
  has[id] = null;
  watcher.run();
  // in dev build, check and stop circular updates.
  if (process.env.NODE_ENV !== "production" && has[id] != null) {
    circular[id] = (circular[id] || 0) + 1;
    if (circular[id] > MAX_UPDATE_COUNT) {
      warn(
        "You may have an infinite update loop " +
          (watcher.user
            ? `in watcher with expression "${watcher.expression}"`
            : `in a component render function.`),
        watcher.vm
      );
      break;
    }
  }
}
// keep copies of post queues before resetting state
const activatedQueue = activatedChildren.slice();
const updatedQueue = queue.slice();

resetSchedulerState();

// call component updated and activated hooks
callActivatedHooks(activatedQueue);
callUpdatedHooks(updatedQueue);

// devtool hook
/* istanbul ignore if */
if (devtools && config.devtools) {
  devtools.emit("flush");
}
```

触发更新完成后，对队列进行初始化操作，激活与更新的钩子。

## computed 缓存的原理

```js

  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

evaluate 这在创建 computedGetter 的时候进行了调用。如果是 computed 属性是 dirty 是 true, 然后会调用 evaluate 返回当前 computed 的值，然后把 dirty 设置为 false。createComputedGetter 是一个柯里化的方法，缓存了 key，当前调用 computed 中 key 这个值的时候 dirty 已经被设置为 false，直接会返回 watcher.value 的值。当其中的依赖值发生变化的时候，defineReative 又会在 set 的时候调用 dep.notify 触发更新。nofity 又会重新调用 watcher 的 update 方法，update 最终会走到 flushSchedulerQueue 方法，调用 watcher.run()重新进行求值。

## 依赖卸载

```js

  teardown() {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      let i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  }

```

remove(this.vm.\_watchers, this)将 watchers 上的当前 watcher 移除，移除当前依赖上的自己。
将 active 置为 false，当前的 watcher 不会再被激活进行求值。

## 总结

watcher 观察的数据都是响应式的，需要在 get 的时候去进行依赖收集，否则就没有观察者。而当数据发生变化的时候，又要触发当前 watcher 进行 update，让视图 re-render 或者去进行数据的更新。
