# new Vue 进行初始化

new Vue 就开始创建 Vue 的实力了, 初始化完成之前会判断 $options.$el 如果有就会去挂载组件

```js
  Vue.prototype._init = function (options) {
    const vm = this;
    // a uid
    vm._uid = uid++;
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, "beforeCreate");
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, "created");

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
```

## initLifecycle

定义生命周期每个阶段是否完成的标识。

```js
export function initLifecycle(vm) {
  const options = vm.$options;

  // locate first non-abstract parent
  let parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}
```

## initEvents

初始化事件，在 Vue 中父组件给组件绑定事件，@, @v-no。例如@click.native,注册的事件。当子组件实例化的时候就需要把这些事件进行初始化了。

```js
export function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  //   如果父组件注册的事件不为空则调用updateComponentListeners方法
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}
```

### updateComponentListeners

updateComponentListeners 是调用了 updateListeners

```js
export function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(
    listeners,
    oldListeners || {},
    add,
    remove,
    createOnceHandler,
    vm
  );
  target = undefined;
}
```

### updateListeners

updateListeners 接受了 6 个参数，新旧方法添加和移除方法，还有只调用一次的方法还有当前组件的实例

```js
export function updateListeners(on, oldOn, add, remove, createOnceHandler, vm) {
  // on 新绑定的事情
  let name, def, cur, old, event;
  for (name in on) {
    // 拿到新绑定事件的方法
    def = cur = on[name];
    // 旧绑定事件的方法
    old = oldOn[name];
    // { click.capture.passive解析成对象
    //     name,
    //     once,
    //     capture,
    //     passive,
    // }
    event = normalizeEvent(name);
    // 如果cur 不存在报错
    if (isUndef(cur)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `Invalid handler for event "${event.name}": got ` + String(cur),
          vm
        );
      // 如果old不存在，
    } else if (isUndef(old)) {
      // 如果当前cur.fs不存在，给当前的cur绑定一个fns的方法
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove(event.name, oldOn[name], event.capture);
    }
  }
}
```

### normalizeEvent

```js
const normalizeEvent = cached((name) => {
  const passive = name.charAt(0) === "&";
  name = passive ? name.slice(1) : name;
  const once = name.charAt(0) === "~"; // Prefixed last, checked first
  name = once ? name.slice(1) : name;
  const capture = name.charAt(0) === "!";
  name = capture ? name.slice(1) : name;
  return {
    name,
    once,
    capture,
    passive,
  };
});
```

### createFnInvoker

主要用来处理 fns 是否是数组的情况

```js
export function createFnInvoker(fns, vm) {
  function invoker() {
    const fns = invoker.fns;
    if (Array.isArray(fns)) {
      const cloned = fns.slice();
      for (let i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`);
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`);
    }
  }
  invoker.fns = fns;
  return invoker;
}
```

### invokeWithErrorHandling

主要是用来处理函数调用时候出的错误，

```js
export function invokeWithErrorHandling(handler, context, args, vm, info) {
  let res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
  } catch (e) {
    handleError(e, vm, info);
  }
  return res;
}
```

## initRender

initRender 用来初始化 VDOM 生成的方法及属性。
编译模版提供是方法 vm.\_c， vm.$createElement 是为手写 VDOM 提供的方法第一个参数是 节点名、属性、children、componentOptions.vm.$slots 默认插槽，作用域插槽 vm.$scopedSlots。把$attrs 与$listener 定义为响应式

```js
export function initRender(vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  // 编译模版写好的方法
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  // normalization is always applied for the public version, used in
  // user-written render functions.
  // 手写vnode提供更多方法
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== "production") {
    defineReactive(
      vm,
      "$attrs",
      (parentData && parentData.attrs) || emptyObject,
      () => {
        !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm);
      },
      true
    );
    defineReactive(
      vm,
      "$listeners",
      options._parentListeners || emptyObject,
      () => {
        !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm);
      },
      true
    );
  } else {
    defineReactive(
      vm,
      "$attrs",
      (parentData && parentData.attrs) || emptyObject,
      null,
      true
    );
    defineReactive(
      vm,
      "$listeners",
      options._parentListeners || emptyObject,
      null,
      true
    );
  }
}
```

## callHook(vm , 'beforecreate')

完成给 Vue 提供各种必须的更新挂着组件方法、注入事件、

```js
export function callHook(vm, hook) {
  // 当调用生命周期函数钩子的时候禁止依赖收集
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  // 查看是否有这个函数方法
  const handlers = vm.$options[hook];
  const info = `${hook} hook`;
  //   如果有则调用
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  //   如果hasHookEvent是true则触发调用
  if (vm._hasHookEvent) {
    vm.$emit("hook:" + hook);
  }
  popTarget();
}
```

## initInjections

找到要注入的 inject，把这些值进行响应式的设置。

```js
export function initInjections(vm) {
  const result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach((key) => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== "production") {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
              `overwritten whenever the provided component re-renders. ` +
              `injection being mutated: "${key}"`,
            vm
          );
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}
```

## initState

在 beforeCreate 和 inject 之后 data 和 props，methods 进行初始化操作。

```js
export function initState(vm) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

### initProps

接受传递的 props,对 props 进行响应式处理。

```js
export const isReservedAttribute = makeMap("key,ref,slot,slot-scope,is");
function initProps(vm, propsOptions) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  // root instance props should be converted
  //   如果不是根组件禁止依赖收集
  if (!isRoot) {
    toggleObserving(false);
  }
  for (const key in propsOptions) {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    if (process.env.NODE_ENV !== "production") {
      const hyphenatedKey = hyphenate(key);

      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
        }
      });
    } else {
      defineReactive(props, key, value);
    }

    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}
```

### initMethod

对 methods 方法进行校验，查看与 props 是否重复值如果有则报警告，没有则把方法绑定到当前组件的实例上面

```js
function initMethods(vm, methods) {
  const props = vm.$options.props;
  for (const key in methods) {
    if (process.env.NODE_ENV !== "production") {
      if (typeof methods[key] !== "function") {

    }
    vm[key] = typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
  }
}
```

### initData

先检查 data 是对象还是函数如果是函数则调用 getData 方法获取数据，否则置为空。然后对象 data、props、还有 methods 中的 key 进行校验，如果有相同值则抛出报错。没有则对 data 的每个属性进行响应式处理。observe(data, true)
如果有 vm 定义了 data 数据则对 data 进行初始化操作

```js
function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (process.env.NODE_ENV !== "production") {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```

### initComputed

初始化 computed 的方法,定义个 watchers 对象来存储 computed 的每个 key 值,每个 wachers[key] = new Watcher。
wather 一共接受 5 个属性，第一是当前实例，第二个是表达式，第三个是回调函数，第一个是 options 第五个是是否是渲染 wather
options 中的 lazy 属性为 true 为 computed。

```js
new Vue({
  computed: {
    fullName() {
      return this.firstName + this.lastName;
    },
  },
});
new Vue({
  computed: {
    fullName: {
      get() {
        return this.firstName + this.lastName;
      },
      set(newValue) {
        console.log(newValue);
      },
    },
  },
});
```

```js
const computedWatcherOptions = { lazy: true };
function initComputed(vm, computed) {
  const watchers = (vm._computedWatchers = Object.create(null));
  const isSSR = isServerRendering();
  for (const key in computed) {
    const userDef = computed[key];
    // get是computed
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }
    // 如果不是服务端渲染
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter || noop, noop,   computedWatcherOptions );
    }
    // 如果这个key不在vm实例上，则定义属性key到vm上的一个computed, 给实例上绑定watch
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      if (key in vm.$data) {
    }
  }
}
```

### initWatch

对 watch 进行初始化，拿到 watch 对象，然后遍历他身上的每个属性，然后拿到属性和属性属性值创建 watcher 对象。每次数据发生变化的时候会触发依赖更新。

```js
 d: {
      handler: () {

      },
      immediate: true,
      deep: true
    },

```

```js
function initWatch(vm, watch) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  // 如果是对象就拿handler
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}
```

## initProvide

```js
export function initProvide(vm) {
  const provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === "function" ? provide.call(vm) : provide;
  }
}
```

## callHook(vm, "created");

created 是时候已经创建好了 Vue 的实例。

## 总结

在调用 created 钩子的时候已经完成了对实例上的 props 的初始化，methods 的初始化，data 初始化、computed 初始化、watch 的初始化。以及 inject 和 provide 的注入。

这 5 个选项的初始化顺序不是任意的，而是经过精心安排的。只有按照这种顺序初始化我们才能在开发中在 data 中可以使用 props，在 watch 中可以观察 data 和 props
