# new Vue 对数据进行响应式

在 vue.js 中可以在 data 中定时数据，在模版中生命这个这个变量，这个数据就会被渲染到页面上。

```html
<div>{{msg}}</div>
```

```js
const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello world",
  },
});
```

```html
<div>hello world</div>
```

当修改 vm 的 data 数据的之时视图只也会发生变化

```js
vm.$data.msg = "你好";
```

```html
<div>你好</div>
```

在之前分析源码中 initData 方法会把 data 数据转成响应式的数据.

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

```js
data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
```

data 如果是一个方法，调用 getData 调用 data 方法使用它的返的对象。如果不是 fcuntion 则返回 data 或者给个默认空对象

```js
observe(data, true /* asRootData */);
```

observe 对 data 对象上的每个属性设置 getter/setter

## 总结

创建 Vue 实例会对实例 data 对象进行响应式处理，通过调用 observe(data, true).
