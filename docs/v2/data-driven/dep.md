# 依赖收集原理

![](https://v2.cn.vuejs.org/images/data.png)
什么是依赖收集，依赖收集指的是收集当前的观察者。从官方的图上面就可以看出来。getter 是收集的是当前的 watcher，设置的时候也是触发当前的 watcher。
每个属性都会被 defineReactive。defineReactive 函数创建了一个 dep 用与依赖收集和触发的。

```js
let uid = 0;
export default class Dep {
  static target;
  id;
  subs;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    remove(this.subs, sub);
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  notify() {
    const subs = this.subs.slice();
    if (process.env.NODE_ENV !== "production" && !config.async) {
      subs.sort((a, b) => a.id - b.id);
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
Dep.target = null;
```

Dep 类方法用来依赖收集，辅助方法 pushTarget 和 popTarget

## 依赖收集

```js
this.id = uid++;
this.subs = [];
```

给每个 dep 添加一个 id，subs 则用来存放需要收集的依赖。

```js
depend() {
    if (Dep.target) {
        Dep.target.addDep(this);
    }
}
```

depend 是依赖的的意思,这块也是对象依赖进行一个收集，首先会判断 Dep.target 是否存在，如果存在则调用 Dep.target.addDep(this);进行依赖收集。

## 依赖触发

```js
notify() {
    const subs = this.subs.slice();
    if (process.env.NODE_ENV !== "production" && !config.async) {
      subs.sort((a, b) => a.id - b.id);
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }

```

this.subs.slice()把 subs 转成数组，subs.sort((a, b) => a.id - b.id)对当前的依赖进行排序，遍历每一个 subs 对象触发 update 更新。

## 总结

dep 作用就是依赖收集与依赖触发。depend 进行依赖收集，notify 进行依赖触发，subs 对依赖进行存储。
