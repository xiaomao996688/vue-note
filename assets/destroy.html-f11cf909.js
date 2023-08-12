import{_ as n,o as s,c as a,d as t}from"./app-bac77e8c.js";const p={},e=t(`<h1 id="销毁阶段" tabindex="-1"><a class="header-anchor" href="#销毁阶段" aria-hidden="true">#</a> 销毁阶段</h1><p>生命周期的最后一个阶段就是销毁阶段。当调用了$destroy 方法之时开始进行销毁 <img src="https://vue-js.com/learn-vue/assets/img/7.810540a5.png" alt=""></p><h2 id="开始销毁" tabindex="-1"><a class="header-anchor" href="#开始销毁" aria-hidden="true">#</a> 开始销毁</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">$destroy</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_isBeingDestroyed<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">callHook</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token string">&quot;beforeDestroy&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  vm<span class="token punctuation">.</span>_isBeingDestroyed <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token comment">// remove self from parent</span>
  <span class="token keyword">const</span> parent <span class="token operator">=</span> vm<span class="token punctuation">.</span>$parent<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parent <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>parent<span class="token punctuation">.</span>_isBeingDestroyed <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>abstract<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">remove</span><span class="token punctuation">(</span>parent<span class="token punctuation">.</span>$children<span class="token punctuation">,</span> vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// teardown watchers</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_watcher<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    vm<span class="token punctuation">.</span>_watcher<span class="token punctuation">.</span><span class="token function">teardown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">let</span> i <span class="token operator">=</span> vm<span class="token punctuation">.</span>_watchers<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    vm<span class="token punctuation">.</span>_watchers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">teardown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// remove reference from data ob</span>
  <span class="token comment">// frozen object may not have observer.</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_data<span class="token punctuation">.</span>__ob__<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    vm<span class="token punctuation">.</span>_data<span class="token punctuation">.</span>__ob__<span class="token punctuation">.</span>vmCount<span class="token operator">--</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// call the last hook...</span>
  vm<span class="token punctuation">.</span>_isDestroyed <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token comment">// invoke destroy hooks on current rendered tree</span>
  vm<span class="token punctuation">.</span><span class="token function">__patch__</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_vnode<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// fire destroyed hook</span>
  <span class="token function">callHook</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token string">&quot;destroyed&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// turn off all instance listeners.</span>
  vm<span class="token punctuation">.</span><span class="token function">$off</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// remove __vue__ reference</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$el<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    vm<span class="token punctuation">.</span>$el<span class="token punctuation">.</span>__vue__ <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// release circular reference (#6759)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$vnode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    vm<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>parent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>销毁之前调用了实例当前的 beforeDestroy,然后拿到当前实例的父组件开始对每个子元素进行卸载，对当前 watchers 中的每个 watcher 进行进行卸载操作，用 patch 方法传入最近的 DOM 为 null 则会把之前的 DOM 都进行下载，调用销毁完成方法，销毁当前 vm 实例上绑定的所有事件，把当前虚拟节点的父节点置为 null。销毁彻底结束。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token literal-property property">vm</span><span class="token operator">:</span> Component <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_isBeingDestroyed<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果当前组件_isBeingDestroyed 为 true 则表示已经销毁过。直接 return</p><h2 id="销毁中" tabindex="-1"><a class="header-anchor" href="#销毁中" aria-hidden="true">#</a> 销毁中</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">callHook</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token string">&quot;beforeDestroy&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>触发 beforeDestroy 销毁之前的函数。</p><p>接下来进行真正的销毁</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> parent <span class="token operator">=</span> vm<span class="token punctuation">.</span>$parent<span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>parent <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>parent<span class="token punctuation">.</span>_isBeingDestroyed <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>abstract<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">remove</span><span class="token punctuation">(</span>parent<span class="token punctuation">.</span>$children<span class="token punctuation">,</span> vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果当前的父组件不是 abstract 也就是 keep-alive 之类的组件而且父组件没有被销毁，把当前实例从父组件中移除掉。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// teardown watchers</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_watcher<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  vm<span class="token punctuation">.</span>_watcher<span class="token punctuation">.</span><span class="token function">teardown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> i <span class="token operator">=</span> vm<span class="token punctuation">.</span>_watchers<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  vm<span class="token punctuation">.</span>_watchers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">teardown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>vm._watcher.teardown();会移除自身依赖的数据的删除，teardown 是将自身 deps 中依赖的自己移除。每次 new Watcher 时会把当前 this._watchers.push(this)所有实例内的数据对其他数据的依赖都会存放在实例的_watchers 属性中,所以需要卸载掉这个依赖 vm._watchers[i].teardown();</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_data<span class="token punctuation">.</span>__ob__<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  vm<span class="token punctuation">.</span>_data<span class="token punctuation">.</span>__ob__<span class="token punctuation">.</span>vmCount<span class="token operator">--</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从数据中删除引用 ,冻结对象可能没有观察者。</p><h2 id="销毁结束" tabindex="-1"><a class="header-anchor" href="#销毁结束" aria-hidden="true">#</a> 销毁结束</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>vm<span class="token punctuation">.</span>_isDestroyed <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token comment">// invoke destroy hooks on current rendered tree</span>
vm<span class="token punctuation">.</span><span class="token function">__patch__</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_vnode<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">callHook</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token string">&quot;destroyed&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// turn off all instance listeners.</span>
vm<span class="token punctuation">.</span><span class="token function">$off</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// remove __vue__ reference</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$el<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  vm<span class="token punctuation">.</span>$el<span class="token punctuation">.</span>__vue__ <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// release circular reference (#6759)</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>$vnode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  vm<span class="token punctuation">.</span>$vnode<span class="token punctuation">.</span>parent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当把 vnode 完全卸载完成之后，调用实例 destroyed 生命周期 方法，vm.$off()，卸载实例所有的事件监听。把当前vm.$node.parent 设置为 null。意味着销毁阶段结束了。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>销毁之前调用了实例当前的 beforeDestroy,然后拿到当前实例的父组件开始对每个子元素进行卸载，自身的 watcher 进行了卸载和 watchers 中的每个 watcher 进行进行卸载操作，用 patch 方法传入最近的 DOM 为 null 则会把之前的 DOM 都进行卸载，调用销毁完成方法，销毁当前 vm 实例上绑定的所有事件，把当前虚拟节点的父节点置为 null。销毁彻底结束。</p>`,22),o=[e];function c(i,l){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","destroy.html.vue"]]);export{r as default};
