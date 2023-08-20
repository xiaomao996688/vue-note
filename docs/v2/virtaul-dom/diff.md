# 虚拟 DOM 比较

虚拟 DOM 比较其实就的对比两个虚拟 DOM 树(JavaScript 的对象数据)，新的虚拟 DOM 树与老的虚拟 DOM 进行比较，如果新的 DOM 树与老的 DOM 树进行对比，在老的 DOM 树上更新发生的变化，然后进行视图的重新渲染。
<img :src="$withBase('../assets/v2/diff.png')" alt="">

在 mountComponent 挂载阶段会会为每个 vm 创建一个实例 Wather 来监听当前数据是否发生变化，如果发生变化则调用\_update 方法触发 vm.\_\_patch\_\进行更新视图。

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
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // 否则调用 这个， el就变成了虚拟dom
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
};
```

patch 方法其实是通过 createPatchFunction 来返回的函数

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop;
```

createPatch 返回 path 方法接受两个参数，一个是 oldVnode, vnode, hydrating, removeOnly。

```js
export const patch = createPatchFunction({ nodeOps, modules });

export const patch = function createPatchFunction(backend) {
  let i, j;
  const cbs = {};

  const { modules, nodeOps } = backend;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {}

  function createRmCb(childElm, listeners) {}

  function removeNode(el) {}

  function isUnknownElement(vnode, inVPre) {}

  let creatingElmInVPre = 0;

  function createElm(
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {}

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {}

  function initComponent(vnode, insertedVnodeQueue) {}

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {}

  function insert(parent, elm, ref) {}

  function createChildren(vnode, children, insertedVnodeQueue) {}

  function isPatchable(vnode) {}

  function invokeCreateHooks(vnode, insertedVnodeQueue) {}

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope(vnode) {}

  function addVnodes(
    parentElm,
    refElm,
    vnodes,
    startIdx,
    endIdx,
    insertedVnodeQueue
  ) {}

  function invokeDestroyHook(vnode) {}

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {}

  function removeAndInvokeRemoveHook(vnode, rm) {}

  function updateChildren(
    parentElm,
    oldCh,
    newCh,
    insertedVnodeQueue,
    removeOnly
  ) {}

  function checkDuplicateKeys(children) {}

  function findIdxInOld(node, oldCh, start, end) {}

  function patchVnode(
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {}

  function invokeInsertHook(vnode, queue, initial) {}

  let hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  const isRenderedModule = makeMap("attrs,class,staticClass,staticStyle,key");

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {}

  function assertNodeMatch(node, vnode, inVPre) {}

  return function patch(oldVnode, vnode, hydrating, removeOnly) {};
};
```

## patch

hydrating 为 true 则是服务端渲染方式。path 会做一些预处理，比如是否是第一次 patch(主要是用是否有 oldVnode 进行来判断)，第一次的话直接传入当前的 vnode 去创建对应的元素即可。createElm 会去创建对应的元素，判断这个 vnode 节点还是组件。不是第一次则要对比 newVnode 与 oldVnode 的差异调用 patchVnode。

```js
return function patch(oldVnode, vnode, hydrating, removeOnly) {
  // 判断新vnode是否存在
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
    return;
  }

  let isInitialPatch = false;
  //   先插入vnode节点的队列，这个方法是用来触发插入vnode的上面的钩子方法
  const insertedVnodeQueue = [];
  // 首次渲染oldVnode不存在
  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    // 直接创建Vnode即可，没有挂载到DOM上
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue);
  } else {
    // 判断是否是真实dom,
    const isRealElement = isDef(oldVnode.nodeType);
    // 不是真实DOM
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node 对比两个vnode 的差异
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
    } else {
      if (isRealElement) {
        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR);
          hydrating = true;
        }
        // 服务端渲染相关
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true);
            return oldVnode;
          } else if (process.env.NODE_ENV !== "production") {
            warn(
              "The client-side rendered virtual DOM tree is not matching " +
                "server-rendered content. This is likely caused by incorrect " +
                "HTML markup, for example nesting block-level elements inside " +
                "<p>, or missing <tbody>. Bailing hydration and performing " +
                "full client-side render."
            );
          }
        }
        // 把真实dom转成vnode
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it
        oldVnode = emptyNodeAt(oldVnode);
      }
      // 获取oldVnode中的核心元素
      // replacing existing element
      const oldElm = oldVnode.elm;
      //   找到这个元素的父元素，将来把要真实dom挂载到父元素上
      const parentElm = nodeOps.parentNode(oldElm);
      // 把vnode转成DOM
      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      );

      // update parent placeholder node element, recursively
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent;
        const patchable = isPatchable(vnode);
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor);
          }
          ancestor.elm = vnode.elm;
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor);
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert;
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]();
              }
            }
          } else {
            registerRef(ancestor);
          }
          ancestor = ancestor.parent;
        }
      }
      //如果oldVnode存在，则删除旧的vnode
      // destroy old node
      if (isDef(parentElm)) {
        removeVnodes(parentElm, [oldVnode], 0, 0);
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode);
      }
    }
  }
  //isInitialPatch 是否是真实patch，如果是true则不会去触发vnode.insert钩子函数
  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
  return vnode.elm;
};
```

## patchVnode

patchVnode 方法接受旧的 vnode 和新的 vnode 的。

1. 如果 newVnode 和 oldVnode 相等则直接 return
2. 获取新旧节点的子节点
   - 如果没有 text 则要对比子节点
     首先判断新老节点是否存在，如果都存在切不相等则调用 updateChildren 方法更新子节点。
     如果新节点有子节点，老节点没有子节点，则检测新的 key 是否重复。判断 oldVnode 是否有 text 属性，调用 addVnodes 把新元素的子节点添加到 DOM 树。
     如果老节点有子节点，新节点没有子节点，则调用 removeVnodes。把子节点的删除，移除 DOM 事件。调用 destory 狗子
     如果老节点有文本元素则直接清空老节点的文本内容。
   - 判断 newvnode 是否有文本子节点，如果有文本节点则需要判断文本节点是否相同

```js
function patchVnode(
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  if (oldVnode === vnode) {
    return;
  }
  // 如果有vnode的有子节点就克隆一份
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode);
  }

  const elm = (vnode.elm = oldVnode.elm);

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
    } else {
      vnode.isAsyncPlaceholder = true;
    }
    return;
  }
  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  let i;
  const data = vnode.data;
  if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
    i(oldVnode, vnode);
  }

  const oldCh = oldVnode.children;
  const ch = vnode.children;
  if (isDef(data) && isPatchable(vnode)) {
    // 调用cbs中的钩子函数，操作节点属性/样式/事件……
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    // 用户自定义钩子
    if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
  }
  //   如果不存在文本节点
  if (isUndef(vnode.text)) {
    // 如果old与new不相等
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
    } else if (isDef(ch)) {
      // 检查key是否重复
      if (process.env.NODE_ENV !== "production") {
        checkDuplicateKeys(ch);
      }
      //   如果是文件节点，则先清空文件内容，然后为当前dom加入子节点
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      //移除dom元素和事件
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      //文件节点也清空元素
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, "");
    }
    // 如果文件节点都不一样
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  }
  if (isDef(data)) {
    if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
  }
}
```

## updateChildren

updateChildren 的作用是对比新老子节点之间的差异并更新到 dom 树上。updateChildren 会先拿到新旧节点的索引。当新旧节点都没有被遍历完的时候继续遍历。

```js
function updateChildren(
  parentElm,
  oldCh,
  newCh,
  insertedVnodeQueue,
  removeOnly
) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly;

  if (process.env.NODE_ENV !== "production") {
    checkDuplicateKeys(newCh);
  }
  //当新节点和旧节点都没有遍历完成
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 判断老的开始节点是否有知，如果没有则获取下一个节点作为开始值
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      // 判断老的结束节点是否有知，如果没有则获取下一个节点作为结束值
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
      // 如果新开始和旧开始是同一个节点则调用patchVnode的更节点
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(
        oldStartVnode,
        newStartVnode,
        insertedVnodeQueue,
        newCh,
        newStartIdx
      );
      //   更新new/oldVnode 及其索引
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
      //   然后判断结束节点
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(
        oldEndVnode,
        newEndVnode,
        insertedVnodeQueue,
        newCh,
        newEndIdx
      );
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
      //  老的结束节点和新的开始节点，如果相同则移动老节点的位置到新节点的索引位置
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      patchVnode(
        oldStartVnode,
        newEndVnode,
        insertedVnodeQueue,
        newCh,
        newEndIdx
      );
      canMove &&
        nodeOps.insertBefore(
          parentElm,
          oldStartVnode.elm,
          nodeOps.nextSibling(oldEndVnode.elm)
        );
      // 然后节点移动位置
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
      //   旧结束和新开始
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      patchVnode(
        oldEndVnode,
        newStartVnode,
        insertedVnodeQueue,
        newCh,
        newStartIdx
      );
      canMove &&
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 以上情况都不满足的情况，
      //   从新的开始节点开头取一个key去老节点中找相同节点
      if (isUndef(oldKeyToIdx))
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      // 如果没找到则创建新的元素，
      if (isUndef(idxInOld)) {
        // New element
        createElm(
          newStartVnode,
          insertedVnodeQueue,
          parentElm,
          oldStartVnode.elm,
          false,
          newCh,
          newStartIdx
        );
      } else {
        // 如果找到了需要的移动的Vnode
        vnodeToMove = oldCh[idxInOld];
        // 如果找的节点与新节点是一样的话则调用patchVnode进行更新
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(
            vnodeToMove,
            newStartVnode,
            insertedVnodeQueue,
            newCh,
            newStartIdx
          );
          //然后把老节点移动到最前面
          oldCh[idxInOld] = undefined;
          canMove &&
            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        } else {
          // 如果不是samevnode则创建新的vnode
          // same key but different element. treat as new element
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            false,
            newCh,
            newStartIdx
          );
        }
      }
      //   更新节点
      newStartVnode = newCh[++newStartIdx];
    }
  }
  //   当oldStartIndex大于oldEndIdx有需要新增的节点
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
    addVnodes(
      parentElm,
      refElm,
      newCh,
      newStartIdx,
      newEndIdx,
      insertedVnodeQueue
    );
    // 新的开始大于新结束则有节点需要移除
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}
```

## 总结

虚拟 DOM 的比较其实就是对比节点之间的差异，采用双端队列的做法。新开始和新开始对比，新结束和旧结束对比，如果相同则更新索引.老开始与新结束对比，如果 sameVnode 则进行子节点的比较完成后进行位置的移动并更新索引。新开始与老结束对比，如果 samevnode 则进行子节点的比较完成后进行位置的移动并更新索引。如果上述情况都不满足，则会拿到新的新开始元素在旧的元素中找是否有相同的元素，如果有则进行 patchVnode 然后移动位置更新索引，没有则调用 createElm 创建当前元素。到了最后如果 oldStartIndex 大于 oldEndIdx 说明有需要新增的元素，根据索引找到元素并添加到 DOM 树中，如果 newStartIdx 大于 newEndIdx 则说明有需要移除的元素，调用 removeVnodes 传入父元素及要移除元素的范围。
