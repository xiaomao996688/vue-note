import{_ as t,o as p,c as e,a as n,b as s,d as o}from"./app-b2c60ca5.js";const c={},i=n("h1",{id:"虚拟-dom-比较",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#虚拟-dom-比较","aria-hidden":"true"},"#"),s(" 虚拟 DOM 比较")],-1),l=["src"],u=o(`<p>在 mountComponent 挂载阶段会会为每个 vm 创建一个实例 Wather 来监听当前数据是否发生变化，如果发生变化则调用_update 方法触发 vm.__patch_\\进行更新视图。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_update</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> hydrating</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> prevEl <span class="token operator">=</span> vm<span class="token punctuation">.</span>$el<span class="token punctuation">;</span>
  <span class="token keyword">const</span> prevVnode <span class="token operator">=</span> vm<span class="token punctuation">.</span>_vnode<span class="token punctuation">;</span>
  <span class="token keyword">const</span> restoreActiveInstance <span class="token operator">=</span> <span class="token function">setActiveInstance</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  vm<span class="token punctuation">.</span>_vnode <span class="token operator">=</span> vnode<span class="token punctuation">;</span>
  <span class="token comment">// Vue.prototype.__patch__ is injected in entry points</span>
  <span class="token comment">// based on the rendering backend used.</span>
  <span class="token comment">// 如果是首次渲染调用这个</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>prevVnode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// initial render</span>
    vm<span class="token punctuation">.</span>$el <span class="token operator">=</span> vm<span class="token punctuation">.</span><span class="token function">__patch__</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$el<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> hydrating<span class="token punctuation">,</span> <span class="token boolean">false</span> <span class="token comment">/* removeOnly */</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 否则调用 这个， el就变成了虚拟dom</span>
    <span class="token comment">// updates</span>
    vm<span class="token punctuation">.</span>$el <span class="token operator">=</span> vm<span class="token punctuation">.</span><span class="token function">__patch__</span><span class="token punctuation">(</span>prevVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>patch 方法其实是通过 createPatchFunction 来返回的函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>__patch__ <span class="token operator">=</span> inBrowser <span class="token operator">?</span> patch <span class="token operator">:</span> noop<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>createPatch 返回 path 方法接受两个参数，一个是 oldVnode, vnode, hydrating, removeOnly。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> patch <span class="token operator">=</span> <span class="token function">createPatchFunction</span><span class="token punctuation">(</span><span class="token punctuation">{</span> nodeOps<span class="token punctuation">,</span> modules <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">patch</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">createPatchFunction</span><span class="token punctuation">(</span><span class="token parameter">backend</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> i<span class="token punctuation">,</span> j<span class="token punctuation">;</span>
  <span class="token keyword">const</span> cbs <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token punctuation">{</span> modules<span class="token punctuation">,</span> nodeOps <span class="token punctuation">}</span> <span class="token operator">=</span> backend<span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> hooks<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    cbs<span class="token punctuation">[</span>hooks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span>j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> modules<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>j<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>modules<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">[</span>hooks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        cbs<span class="token punctuation">[</span>hooks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>modules<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">[</span>hooks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">emptyNodeAt</span><span class="token punctuation">(</span><span class="token parameter">elm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">createRmCb</span><span class="token punctuation">(</span><span class="token parameter">childElm<span class="token punctuation">,</span> listeners</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">removeNode</span><span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">isUnknownElement</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> inVPre</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">let</span> creatingElmInVPre <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">createElm</span><span class="token punctuation">(</span>
    <span class="token parameter">vnode<span class="token punctuation">,</span>
    insertedVnodeQueue<span class="token punctuation">,</span>
    parentElm<span class="token punctuation">,</span>
    refElm<span class="token punctuation">,</span>
    nested<span class="token punctuation">,</span>
    ownerArray<span class="token punctuation">,</span>
    index</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">createComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> parentElm<span class="token punctuation">,</span> refElm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">initComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> insertedVnodeQueue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reactivateComponent</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> parentElm<span class="token punctuation">,</span> refElm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">insert</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> elm<span class="token punctuation">,</span> ref</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">createChildren</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> children<span class="token punctuation">,</span> insertedVnodeQueue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">isPatchable</span><span class="token punctuation">(</span><span class="token parameter">vnode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">invokeCreateHooks</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> insertedVnodeQueue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// set scope id attribute for scoped CSS.</span>
  <span class="token comment">// this is implemented as a special case to avoid the overhead</span>
  <span class="token comment">// of going through the normal attribute patching process.</span>
  <span class="token keyword">function</span> <span class="token function">setScope</span><span class="token punctuation">(</span><span class="token parameter">vnode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">addVnodes</span><span class="token punctuation">(</span>
    <span class="token parameter">parentElm<span class="token punctuation">,</span>
    refElm<span class="token punctuation">,</span>
    vnodes<span class="token punctuation">,</span>
    startIdx<span class="token punctuation">,</span>
    endIdx<span class="token punctuation">,</span>
    insertedVnodeQueue</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">invokeDestroyHook</span><span class="token punctuation">(</span><span class="token parameter">vnode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">removeVnodes</span><span class="token punctuation">(</span><span class="token parameter">parentElm<span class="token punctuation">,</span> vnodes<span class="token punctuation">,</span> startIdx<span class="token punctuation">,</span> endIdx</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">removeAndInvokeRemoveHook</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> rm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">updateChildren</span><span class="token punctuation">(</span>
    <span class="token parameter">parentElm<span class="token punctuation">,</span>
    oldCh<span class="token punctuation">,</span>
    newCh<span class="token punctuation">,</span>
    insertedVnodeQueue<span class="token punctuation">,</span>
    removeOnly</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">checkDuplicateKeys</span><span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">findIdxInOld</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> start<span class="token punctuation">,</span> end</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">patchVnode</span><span class="token punctuation">(</span>
    <span class="token parameter">oldVnode<span class="token punctuation">,</span>
    vnode<span class="token punctuation">,</span>
    insertedVnodeQueue<span class="token punctuation">,</span>
    ownerArray<span class="token punctuation">,</span>
    index<span class="token punctuation">,</span>
    removeOnly</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">invokeInsertHook</span><span class="token punctuation">(</span><span class="token parameter">vnode<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> initial</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">let</span> hydrationBailed <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token comment">// list of modules that can skip create hook during hydration because they</span>
  <span class="token comment">// are already rendered on the client or has no need for initialization</span>
  <span class="token comment">// Note: style is excluded because it relies on initial clone for future</span>
  <span class="token comment">// deep updates (#7063).</span>
  <span class="token keyword">const</span> isRenderedModule <span class="token operator">=</span> <span class="token function">makeMap</span><span class="token punctuation">(</span><span class="token string">&quot;attrs,class,staticClass,staticStyle,key&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Note: this is a browser-only function so we can assume elms are DOM nodes.</span>
  <span class="token keyword">function</span> <span class="token function">hydrate</span><span class="token punctuation">(</span><span class="token parameter">elm<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> inVPre</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">assertNodeMatch</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> inVPre</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token function">patch</span><span class="token punctuation">(</span><span class="token parameter">oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> hydrating<span class="token punctuation">,</span> removeOnly</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="patch" tabindex="-1"><a class="header-anchor" href="#patch" aria-hidden="true">#</a> patch</h2><p>hydrating 为 true 则是服务端渲染方式。path 会做一些预处理，比如是否是第一次 patch(主要是用是否有 oldVnode 进行来判断)，第一次的话直接传入当前的 vnode 去创建对应的元素即可。createElm 会去创建对应的元素，判断这个 vnode 节点还是组件。不是第一次则要对比 newVnode 与 oldVnode 的差异调用 patchVnode。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token function">patch</span><span class="token punctuation">(</span><span class="token parameter">oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> hydrating<span class="token punctuation">,</span> removeOnly</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 判断新vnode是否存在</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token function">invokeDestroyHook</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">let</span> isInitialPatch <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token comment">//   先插入vnode节点的队列，这个方法是用来触发插入vnode的上面的钩子方法</span>
  <span class="token keyword">const</span> insertedVnodeQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 首次渲染oldVnode不存在</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// empty mount (likely as component), create new root element</span>
    <span class="token comment">// 直接创建Vnode即可，没有挂载到DOM上</span>
    isInitialPatch <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token function">createElm</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 判断是否是真实dom,</span>
    <span class="token keyword">const</span> isRealElement <span class="token operator">=</span> <span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>nodeType<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 不是真实DOM</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isRealElement <span class="token operator">&amp;&amp;</span> <span class="token function">sameVnode</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// patch existing root node 对比两个vnode 的差异</span>
      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> removeOnly<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>isRealElement<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// mounting to a real element</span>
        <span class="token comment">// check if this is server-rendered content and if we can perform</span>
        <span class="token comment">// a successful hydration.</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>nodeType <span class="token operator">===</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> oldVnode<span class="token punctuation">.</span><span class="token function">hasAttribute</span><span class="token punctuation">(</span><span class="token constant">SSR_ATTR</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          oldVnode<span class="token punctuation">.</span><span class="token function">removeAttribute</span><span class="token punctuation">(</span><span class="token constant">SSR_ATTR</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          hydrating <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 服务端渲染相关</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isTrue</span><span class="token punctuation">(</span>hydrating<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">hydrate</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">invokeInsertHook</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> oldVnode<span class="token punctuation">;</span>
          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">!==</span> <span class="token string">&quot;production&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">warn</span><span class="token punctuation">(</span>
              <span class="token string">&quot;The client-side rendered virtual DOM tree is not matching &quot;</span> <span class="token operator">+</span>
                <span class="token string">&quot;server-rendered content. This is likely caused by incorrect &quot;</span> <span class="token operator">+</span>
                <span class="token string">&quot;HTML markup, for example nesting block-level elements inside &quot;</span> <span class="token operator">+</span>
                <span class="token string">&quot;&lt;p&gt;, or missing &lt;tbody&gt;. Bailing hydration and performing &quot;</span> <span class="token operator">+</span>
                <span class="token string">&quot;full client-side render.&quot;</span>
            <span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 把真实dom转成vnode</span>
        <span class="token comment">// either not server-rendered, or hydration failed.</span>
        <span class="token comment">// create an empty node and replace it</span>
        oldVnode <span class="token operator">=</span> <span class="token function">emptyNodeAt</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 获取oldVnode中的核心元素</span>
      <span class="token comment">// replacing existing element</span>
      <span class="token keyword">const</span> oldElm <span class="token operator">=</span> oldVnode<span class="token punctuation">.</span>elm<span class="token punctuation">;</span>
      <span class="token comment">//   找到这个元素的父元素，将来把要真实dom挂载到父元素上</span>
      <span class="token keyword">const</span> parentElm <span class="token operator">=</span> nodeOps<span class="token punctuation">.</span><span class="token function">parentNode</span><span class="token punctuation">(</span>oldElm<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 把vnode转成DOM</span>
      <span class="token comment">// create new node</span>
      <span class="token function">createElm</span><span class="token punctuation">(</span>
        vnode<span class="token punctuation">,</span>
        insertedVnodeQueue<span class="token punctuation">,</span>
        <span class="token comment">// extremely rare edge case: do not insert if old element is in a</span>
        <span class="token comment">// leaving transition. Only happens when combining transition +</span>
        <span class="token comment">// keep-alive + HOCs. (#4590)</span>
        oldElm<span class="token punctuation">.</span>_leaveCb <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> parentElm<span class="token punctuation">,</span>
        nodeOps<span class="token punctuation">.</span><span class="token function">nextSibling</span><span class="token punctuation">(</span>oldElm<span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// update parent placeholder node element, recursively</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>parent<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> ancestor <span class="token operator">=</span> vnode<span class="token punctuation">.</span>parent<span class="token punctuation">;</span>
        <span class="token keyword">const</span> patchable <span class="token operator">=</span> <span class="token function">isPatchable</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>ancestor<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> cbs<span class="token punctuation">.</span>destroy<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cbs<span class="token punctuation">.</span>destroy<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span>ancestor<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
          ancestor<span class="token punctuation">.</span>elm <span class="token operator">=</span> vnode<span class="token punctuation">.</span>elm<span class="token punctuation">;</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>patchable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> cbs<span class="token punctuation">.</span>create<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              cbs<span class="token punctuation">.</span>create<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span>emptyNode<span class="token punctuation">,</span> ancestor<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// #6513</span>
            <span class="token comment">// invoke insert hooks that may have been merged by create hooks.</span>
            <span class="token comment">// e.g. for directives that uses the &quot;inserted&quot; hook.</span>
            <span class="token keyword">const</span> insert <span class="token operator">=</span> ancestor<span class="token punctuation">.</span>data<span class="token punctuation">.</span>hook<span class="token punctuation">.</span>insert<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>insert<span class="token punctuation">.</span>merged<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token comment">// start at index 1 to avoid re-invoking component mounted hook</span>
              <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> insert<span class="token punctuation">.</span>fns<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                insert<span class="token punctuation">.</span>fns<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token function">registerRef</span><span class="token punctuation">(</span>ancestor<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
          ancestor <span class="token operator">=</span> ancestor<span class="token punctuation">.</span>parent<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token comment">//如果oldVnode存在，则删除旧的vnode</span>
      <span class="token comment">// destroy old node</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">removeVnodes</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> <span class="token punctuation">[</span>oldVnode<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>tag<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">invokeDestroyHook</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">//isInitialPatch 是否是真实patch，如果是true则不会去触发vnode.insert钩子函数</span>
  <span class="token function">invokeInsertHook</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> isInitialPatch<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> vnode<span class="token punctuation">.</span>elm<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="patchvnode" tabindex="-1"><a class="header-anchor" href="#patchvnode" aria-hidden="true">#</a> patchVnode</h2><p>patchVnode 方法接受旧的 vnode 和新的 vnode 的。</p><ol><li>如果 newVnode 和 oldVnode 相等则直接 return</li><li>获取新旧节点的子节点 <ul><li>如果没有 text 则要对比子节点 首先判断新老节点是否存在，如果都存在切不相等则调用 updateChildren 方法更新子节点。 如果新节点有子节点，老节点没有子节点，则检测新的 key 是否重复。判断 oldVnode 是否有 text 属性，调用 addVnodes 把新元素的子节点添加到 DOM 树。 如果老节点有子节点，新节点没有子节点，则调用 removeVnodes。把子节点的删除，移除 DOM 事件。调用 destory 狗子 如果老节点有文本元素则直接清空老节点的文本内容。</li><li>判断 newvnode 是否有文本子节点，如果有文本节点则需要判断文本节点是否相同</li></ul></li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">patchVnode</span><span class="token punctuation">(</span>
  <span class="token parameter">oldVnode<span class="token punctuation">,</span>
  vnode<span class="token punctuation">,</span>
  insertedVnodeQueue<span class="token punctuation">,</span>
  ownerArray<span class="token punctuation">,</span>
  index<span class="token punctuation">,</span>
  removeOnly</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>oldVnode <span class="token operator">===</span> vnode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 如果有vnode的有子节点就克隆一份</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>elm<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isDef</span><span class="token punctuation">(</span>ownerArray<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// clone reused vnode</span>
    vnode <span class="token operator">=</span> ownerArray<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">cloneVNode</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> elm <span class="token operator">=</span> <span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>elm <span class="token operator">=</span> oldVnode<span class="token punctuation">.</span>elm<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isTrue</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>isAsyncPlaceholder<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>asyncFactory<span class="token punctuation">.</span>resolved<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">hydrate</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>elm<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      vnode<span class="token punctuation">.</span>isAsyncPlaceholder <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// reuse element for static trees.</span>
  <span class="token comment">// note we only do this if the vnode is cloned -</span>
  <span class="token comment">// if the new node is not cloned it means the render functions have been</span>
  <span class="token comment">// reset by the hot-reload-api and we need to do a proper re-render.</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    <span class="token function">isTrue</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>isStatic<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
    <span class="token function">isTrue</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>isStatic<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
    vnode<span class="token punctuation">.</span>key <span class="token operator">===</span> oldVnode<span class="token punctuation">.</span>key <span class="token operator">&amp;&amp;</span>
    <span class="token punctuation">(</span><span class="token function">isTrue</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>isCloned<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token function">isTrue</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>isOnce<span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    vnode<span class="token punctuation">.</span>componentInstance <span class="token operator">=</span> oldVnode<span class="token punctuation">.</span>componentInstance<span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">let</span> i<span class="token punctuation">;</span>
  <span class="token keyword">const</span> data <span class="token operator">=</span> vnode<span class="token punctuation">.</span>data<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isDef</span><span class="token punctuation">(</span><span class="token punctuation">(</span>i <span class="token operator">=</span> data<span class="token punctuation">.</span>hook<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isDef</span><span class="token punctuation">(</span><span class="token punctuation">(</span>i <span class="token operator">=</span> i<span class="token punctuation">.</span>prepatch<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">i</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> oldCh <span class="token operator">=</span> oldVnode<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
  <span class="token keyword">const</span> ch <span class="token operator">=</span> vnode<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isPatchable</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 调用cbs中的钩子函数，操作节点属性/样式/事件……</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> cbs<span class="token punctuation">.</span>update<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> cbs<span class="token punctuation">.</span>update<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 用户自定义钩子</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span><span class="token punctuation">(</span>i <span class="token operator">=</span> data<span class="token punctuation">.</span>hook<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isDef</span><span class="token punctuation">(</span><span class="token punctuation">(</span>i <span class="token operator">=</span> i<span class="token punctuation">.</span>update<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token function">i</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">//   如果不存在文本节点</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>text<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果old与new不相等</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldCh<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isDef</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>oldCh <span class="token operator">!==</span> ch<span class="token punctuation">)</span>
        <span class="token function">updateChildren</span><span class="token punctuation">(</span>elm<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> ch<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> removeOnly<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 检查key是否重复</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">!==</span> <span class="token string">&quot;production&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">checkDuplicateKeys</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">//   如果是文件节点，则先清空文件内容，然后为当前dom加入子节点</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>text<span class="token punctuation">)</span><span class="token punctuation">)</span> nodeOps<span class="token punctuation">.</span><span class="token function">setTextContent</span><span class="token punctuation">(</span>elm<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">addVnodes</span><span class="token punctuation">(</span>elm<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> ch<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> ch<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">//移除dom元素和事件</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldCh<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">removeVnodes</span><span class="token punctuation">(</span>elm<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> oldCh<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">//文件节点也清空元素</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>text<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      nodeOps<span class="token punctuation">.</span><span class="token function">setTextContent</span><span class="token punctuation">(</span>elm<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果文件节点都不一样</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>text <span class="token operator">!==</span> vnode<span class="token punctuation">.</span>text<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    nodeOps<span class="token punctuation">.</span><span class="token function">setTextContent</span><span class="token punctuation">(</span>elm<span class="token punctuation">,</span> vnode<span class="token punctuation">.</span>text<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span><span class="token punctuation">(</span>i <span class="token operator">=</span> data<span class="token punctuation">.</span>hook<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isDef</span><span class="token punctuation">(</span><span class="token punctuation">(</span>i <span class="token operator">=</span> i<span class="token punctuation">.</span>postpatch<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token function">i</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="updatechildren" tabindex="-1"><a class="header-anchor" href="#updatechildren" aria-hidden="true">#</a> updateChildren</h2><p>updateChildren 的作用是对比新老子节点之间的差异并更新到 dom 树上。updateChildren 会先拿到新旧节点的索引。当新旧节点都没有被遍历完的时候继续遍历。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">updateChildren</span><span class="token punctuation">(</span>
  <span class="token parameter">parentElm<span class="token punctuation">,</span>
  oldCh<span class="token punctuation">,</span>
  newCh<span class="token punctuation">,</span>
  insertedVnodeQueue<span class="token punctuation">,</span>
  removeOnly</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> oldStartIdx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> newStartIdx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> oldEndIdx <span class="token operator">=</span> oldCh<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span>oldEndIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> newEndIdx <span class="token operator">=</span> newCh<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span>newEndIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> oldKeyToIdx<span class="token punctuation">,</span> idxInOld<span class="token punctuation">,</span> vnodeToMove<span class="token punctuation">,</span> refElm<span class="token punctuation">;</span>

  <span class="token comment">// removeOnly is a special flag used only by &lt;transition-group&gt;</span>
  <span class="token comment">// to ensure removed elements stay in correct relative positions</span>
  <span class="token comment">// during leaving transitions</span>
  <span class="token keyword">const</span> canMove <span class="token operator">=</span> <span class="token operator">!</span>removeOnly<span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">!==</span> <span class="token string">&quot;production&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">checkDuplicateKeys</span><span class="token punctuation">(</span>newCh<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">//当新节点和旧节点都没有遍历完成</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">&lt;=</span> oldEndIdx <span class="token operator">&amp;&amp;</span> newStartIdx <span class="token operator">&lt;=</span> newEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 判断老的开始节点是否有知，如果没有则获取下一个节点作为开始值</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// Vnode has been moved left</span>
      <span class="token comment">// 判断老的结束节点是否有知，如果没有则获取下一个节点作为结束值</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token comment">// 如果新开始和旧开始是同一个节点则调用patchVnode的更节点</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">patchVnode</span><span class="token punctuation">(</span>
        oldStartVnode<span class="token punctuation">,</span>
        newStartVnode<span class="token punctuation">,</span>
        insertedVnodeQueue<span class="token punctuation">,</span>
        newCh<span class="token punctuation">,</span>
        newStartIdx
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">//   更新new/oldVnode 及其索引</span>
      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token comment">//   然后判断结束节点</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">patchVnode</span><span class="token punctuation">(</span>
        oldEndVnode<span class="token punctuation">,</span>
        newEndVnode<span class="token punctuation">,</span>
        insertedVnodeQueue<span class="token punctuation">,</span>
        newCh<span class="token punctuation">,</span>
        newEndIdx
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token comment">//  老的结束节点和新的开始节点，如果相同则移动老节点的位置到新节点的索引位置</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// Vnode moved right</span>
      <span class="token function">patchVnode</span><span class="token punctuation">(</span>
        oldStartVnode<span class="token punctuation">,</span>
        newEndVnode<span class="token punctuation">,</span>
        insertedVnodeQueue<span class="token punctuation">,</span>
        newCh<span class="token punctuation">,</span>
        newEndIdx
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      canMove <span class="token operator">&amp;&amp;</span>
        nodeOps<span class="token punctuation">.</span><span class="token function">insertBefore</span><span class="token punctuation">(</span>
          parentElm<span class="token punctuation">,</span>
          oldStartVnode<span class="token punctuation">.</span>elm<span class="token punctuation">,</span>
          nodeOps<span class="token punctuation">.</span><span class="token function">nextSibling</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">.</span>elm<span class="token punctuation">)</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 然后节点移动位置</span>
      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token comment">//   旧结束和新开始</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// Vnode moved left</span>
      <span class="token function">patchVnode</span><span class="token punctuation">(</span>
        oldEndVnode<span class="token punctuation">,</span>
        newStartVnode<span class="token punctuation">,</span>
        insertedVnodeQueue<span class="token punctuation">,</span>
        newCh<span class="token punctuation">,</span>
        newStartIdx
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      canMove <span class="token operator">&amp;&amp;</span>
        nodeOps<span class="token punctuation">.</span><span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldEndVnode<span class="token punctuation">.</span>elm<span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span>elm<span class="token punctuation">)</span><span class="token punctuation">;</span>
      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 以上情况都不满足的情况，</span>
      <span class="token comment">//   从新的开始节点开头取一个key去老节点中找相同节点</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>oldKeyToIdx<span class="token punctuation">)</span><span class="token punctuation">)</span>
        oldKeyToIdx <span class="token operator">=</span> <span class="token function">createKeyToOldIdx</span><span class="token punctuation">(</span>oldCh<span class="token punctuation">,</span> oldStartIdx<span class="token punctuation">,</span> oldEndIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
      idxInOld <span class="token operator">=</span> <span class="token function">isDef</span><span class="token punctuation">(</span>newStartVnode<span class="token punctuation">.</span>key<span class="token punctuation">)</span>
        <span class="token operator">?</span> oldKeyToIdx<span class="token punctuation">[</span>newStartVnode<span class="token punctuation">.</span>key<span class="token punctuation">]</span>
        <span class="token operator">:</span> <span class="token function">findIdxInOld</span><span class="token punctuation">(</span>newStartVnode<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> oldStartIdx<span class="token punctuation">,</span> oldEndIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 如果没找到则创建新的元素，</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>idxInOld<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// New element</span>
        <span class="token function">createElm</span><span class="token punctuation">(</span>
          newStartVnode<span class="token punctuation">,</span>
          insertedVnodeQueue<span class="token punctuation">,</span>
          parentElm<span class="token punctuation">,</span>
          oldStartVnode<span class="token punctuation">.</span>elm<span class="token punctuation">,</span>
          <span class="token boolean">false</span><span class="token punctuation">,</span>
          newCh<span class="token punctuation">,</span>
          newStartIdx
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 如果找到了需要的移动的Vnode</span>
        vnodeToMove <span class="token operator">=</span> oldCh<span class="token punctuation">[</span>idxInOld<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token comment">// 如果找的节点与新节点是一样的话则调用patchVnode进行更新</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>vnodeToMove<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">patchVnode</span><span class="token punctuation">(</span>
            vnodeToMove<span class="token punctuation">,</span>
            newStartVnode<span class="token punctuation">,</span>
            insertedVnodeQueue<span class="token punctuation">,</span>
            newCh<span class="token punctuation">,</span>
            newStartIdx
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token comment">//然后把老节点移动到最前面</span>
          oldCh<span class="token punctuation">[</span>idxInOld<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
          canMove <span class="token operator">&amp;&amp;</span>
            nodeOps<span class="token punctuation">.</span><span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> vnodeToMove<span class="token punctuation">.</span>elm<span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span>elm<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// 如果不是samevnode则创建新的vnode</span>
          <span class="token comment">// same key but different element. treat as new element</span>
          <span class="token function">createElm</span><span class="token punctuation">(</span>
            newStartVnode<span class="token punctuation">,</span>
            insertedVnodeQueue<span class="token punctuation">,</span>
            parentElm<span class="token punctuation">,</span>
            oldStartVnode<span class="token punctuation">.</span>elm<span class="token punctuation">,</span>
            <span class="token boolean">false</span><span class="token punctuation">,</span>
            newCh<span class="token punctuation">,</span>
            newStartIdx
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token comment">//   更新节点</span>
      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">//   当oldStartIndex大于oldEndIdx有需要新增的节点</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">&gt;</span> oldEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    refElm <span class="token operator">=</span> <span class="token function">isUndef</span><span class="token punctuation">(</span>newCh<span class="token punctuation">[</span>newEndIdx <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> newCh<span class="token punctuation">[</span>newEndIdx <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span>elm<span class="token punctuation">;</span>
    <span class="token function">addVnodes</span><span class="token punctuation">(</span>
      parentElm<span class="token punctuation">,</span>
      refElm<span class="token punctuation">,</span>
      newCh<span class="token punctuation">,</span>
      newStartIdx<span class="token punctuation">,</span>
      newEndIdx<span class="token punctuation">,</span>
      insertedVnodeQueue
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 新的开始大于新结束则有节点需要移除</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>newStartIdx <span class="token operator">&gt;</span> newEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">removeVnodes</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> oldStartIdx<span class="token punctuation">,</span> oldEndIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>虚拟 DOM 的比较其实就是对比节点之间的差异，采用双端队列的做法。新开始和新开始对比，新结束和旧结束对比，如果相同则更新索引.老开始与新结束对比，如果 sameVnode 则进行子节点的比较完成后进行位置的移动并更新索引。新开始与老结束对比，如果 samevnode 则进行子节点的比较完成后进行位置的移动并更新索引。如果上述情况都不满足，则会拿到新的新开始元素在旧的元素中找是否有相同的元素，如果有则进行 patchVnode 然后移动位置更新索引，没有则调用 createElm 创建当前元素。到了最后如果 oldStartIndex 大于 oldEndIdx 说明有需要新增的元素，根据索引找到元素并添加到 DOM 树中，如果 newStartIdx 大于 newEndIdx 则说明有需要移除的元素，调用 removeVnodes 传入父元素及要移除元素的范围。</p>`,18);function d(a,k){return p(),e("div",null,[i,n("p",null,[s("虚拟 DOM 比较其实就的对比两个虚拟 DOM 树(JavaScript 的对象数据)，新的虚拟 DOM 树与老的虚拟 DOM 进行比较，如果新的 DOM 树与老的 DOM 树进行对比，在老的 DOM 树上更新发生的变化，然后进行视图的重新渲染。 "),n("img",{src:a.$withBase("../assets/v2/diff.png"),alt:""},null,8,l)]),u])}const v=t(c,[["render",d],["__file","diff.html.vue"]]);export{v as default};
