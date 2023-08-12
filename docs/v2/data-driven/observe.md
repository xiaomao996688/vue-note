# 数据相应原理

JavaScript 中使用 Object.defineProperty 可以把对象属性，全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

## observe 的作用

```js
export function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

observe 会返回一个经过响应式的对象。

```js
if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
  ob = value.__ob__;
}
```

如果是 value 上有"\_\_ob\_\_"这个属性,而是 Observer 的子类，就把 ob = value.\_\_ob\_\_的值给 ob 直接返回即可。

```js
if (
  shouldObserve &&
  !isServerRendering() &&
  (Array.isArray(value) || isPlainObject(value)) &&
  Object.isExtensible(value) &&
  !value._isVue
) {
  ob = new Observer(value);
}
```

shouldObserve 默认是 true，!isServerRendering()不是服务端渲染。不是 Vue 实例!value.\_isVue。Object.isExtensible(value) 表示可以给对象添加属性。

## Observer

```js
export class Observer {
  value;
  dep;
  vmCount; // number of vms that have this object as root $data
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

Observer 会给需要响应式的对象新增一个\_\_.ob\_\_的属性，调用 this.walk 来给对象上的每个属性 defineReactive 添加属性。

```js
export function defineReactive(obj, key, val, customSetter, shallow) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
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
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```

```js
const property = Object.getOwnPropertyDescriptor(obj, key);
if (property && property.configurable === false) {
  return;
}
```

对属性进行响应式处理前检查当前对象是否是可配置，如果不可配置则直接 return 即可

```js
// cater for pre-defined getter/setters
const getter = property && property.get;
const setter = property && property.set;
if ((!getter || setter) && arguments.length === 2) {
  val = obj[key];
}
```

预先拿到对象的 setter 和 getter 进行缓存处理。接下来判断如果 getter 不存在，defineReactive 只传入了两个参数，拿到 obj[key]需要响应式的值。

```js
let childOb = !shallow && observe(val);
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
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
  },
});
```

如果 val 是对象的话，递归对 val 的属性进行响应式处理。返回当前对象的响应式属性。Object.defineProperty 用于给对象属性添加 getter 和 setter。描述 key 这个属性，当获取这个属性值的时，调用 reactiveGetter 这个方法。reactiveGetter 方法先会拿到当前的对象属性要描述的 key 对应 value 值。然后进行依赖收集。

```js

    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
```

reactiveSetter 也是拿到当前描述 key 值对应的 value 进行缓存。当设置的新值与旧值一样的时候，直接 return，如果存在自定义 customSetter 方法则调用 customSetter 方法。如果这个对象存在 getter 不存在 setter 则 return。如果存在 setter 则把调用缓存的 setter 把 newVal 传进去，修改当前对象的属性值。对 newVal 这个值进行响应式处理，把返回值赋值给 childOb。当前的 setter 设置完成后触发依赖更新 dep.notify()

## 总结

响应式原理就是给属性添加 getter、setter 方法当在获取属性值的时候收集依赖，再设置属性的时候再出发之前收集依赖。
