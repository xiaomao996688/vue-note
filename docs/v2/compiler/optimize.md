# optimize

优化的目标是遍历 AST 树，检测纯静态的子树，永远不会改变的 DOM。如果检测到这样的 DOM 子树，就可以将它提升为常量。这样每次就不需要在重新渲染时为他们创建新的检点。在 patch 过程中可以跳过这些子树。

```js
export function optimize(root, options) {
  if (!root) return;
  //   是否是静态key
  isStaticKey = genStaticKeysCached(options.staticKeys || "");
  //   是否是平台保留标签
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  //   标记所有非静态节点
  markStatic(root);
  // second pass: mark static roots.
  //   标记静态roots
  markStaticRoots(root, false);
}
```

## markStatic

标记静态节点 node.static = isStatic 如果元素是文本值则静态元素，static 为 true。然后循环遍历每一个子元素。给打上标记

```js
function markStatic(node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== "slot" &&
      node.attrsMap["inline-template"] == null
    ) {
      return;
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i];
      markStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block;
        markStatic(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}
```

### isStatic

检查元素是否是静态节点。如果这个 node.type 是 2 属性节点就不是静态节点，如果 node.type 是 3 文本节点是静态节点。再检测当前的 ast 元素是否是动态指令或者 v-if 、v-for、内部标签等。

```js
function isStatic(node) {
  if (node.type === 2) {
    // expression
    return false;
  }
  if (node.type === 3) {
    // text
    return true;
  }
  return !!(
    node.pre ||
    (!node.hasBindings && // no dynamic bindings
      !node.if &&
      !node.for && // not v-if or v-for or v-else
      !isBuiltInTag(node.tag) && // not a built-in
      isPlatformReservedTag(node.tag) && // not a component
      !isDirectChildOfTemplateFor(node) &&
      Object.keys(node).every(isStaticKey))
  );
}
```

## markStaticRoots

标记跟元素是否是静态节点。如果有绑定 once 属性或者 static 是 true，则标记 staticInFor 为 false。检测 root 其子元素是否是文本节点。然后遍历其子节点 makeStatickRoots。

```js
function markStaticRoots(node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // root作为根节点，它的children 不能只是文件节点。否则成本超过了静态渲染的好处，所以还不如采用全新渲染的方式。
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (
      node.static &&
      node.children.length &&
      !(node.children.length === 1 && node.children[0].type === 3)
    ) {
      node.staticRoot = true;
      return;
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor);
      }
    }
  }
}
```

## 总结

optimize 方法就是使用 staticRoot 和 static 方法来标记 ast 中的元素是否是静态元素，如果是静态元素则标记为 true 否则为 false。
