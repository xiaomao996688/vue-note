import{_ as n,o as s,c as a,a as p}from"./app-3cb0172a.js";const e={},t=p(`<h1 id="virtual-dom" tabindex="-1"><a class="header-anchor" href="#virtual-dom" aria-hidden="true">#</a> Virtual DOM</h1><p>虚拟 DOM 就用 JavaScript 对象来描述的 DOM 节点。之前 generate 会把字符串转成函数方法。 createElement 会接受六个参数，分别是当前实例 vm，当前 a(tag),b(data),c(children),d(normalizationType),flase(alwaysNormalize).createElement 内部会对这些参数少传做一个处理，判断当前是否标签有 data，没有 data 则可能是子元素之类等的处理。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">_c</span><span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token function">_c</span><span class="token punctuation">(</span><span class="token string">&#39;h3&#39;</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token function">_v</span><span class="token punctuation">(</span>\\&quot;hello\\&quot;<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
vm<span class="token punctuation">.</span>\\<span class="token function-variable function">_c</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">,</span> d</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">createElement</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">,</span> d<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后处理过的 tag 和 data 等参数新建一个 vnode 节点。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>vnode <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VNode</span><span class="token punctuation">(</span>
  config<span class="token punctuation">.</span><span class="token function">parsePlatformTagName</span><span class="token punctuation">(</span>tag<span class="token punctuation">)</span><span class="token punctuation">,</span>
  data<span class="token punctuation">,</span>
  children<span class="token punctuation">,</span>
  <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  context
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">{</span>
  <span class="token literal-property property">asyncFactory</span><span class="token operator">:</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">asyncMeta</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;...&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">componentInstance</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">componentOptions</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">context</span><span class="token operator">:</span> <span class="token string">&quot;Vue&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">elm</span><span class="token operator">:</span> <span class="token string">&quot;&lt;div&gt;...&lt;/div&gt;&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">fnContext</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">fnOptions</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">fnScopeId</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">isAsyncPlaceholder</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token literal-property property">isCloned</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token literal-property property">isComment</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token literal-property property">isOnce</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token literal-property property">isRootInsert</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">isStatic</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">ns</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">parent</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token literal-property property">raw</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">&quot;div&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="虚拟-dom-的作用" tabindex="-1"><a class="header-anchor" href="#虚拟-dom-的作用" aria-hidden="true">#</a> 虚拟 DOM 的作用</h2><ol><li>维护视图和状态关系</li><li>复杂视图情况下提升渲染性能</li><li>跨平台</li><li>服务端渲染 DOM</li><li>原生渲染 weex/REACT/NATIVE/小程序/uniapp 等</li></ol><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>因为虚拟 DOM 就是 JavaScript 描述的对象，所以可以通过 Vnode 来生成不同平台对应的标签等从而实现跨平台等作用。</p>`,10),o=[t];function l(c,i){return s(),a("div",null,o)}const u=n(e,[["render",l],["__file","index.html.vue"]]);export{u as default};