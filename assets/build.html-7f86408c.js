import{_ as s,o as n,c as a,d as e}from"./app-b2c60ca5.js";const t={},o=e(`<h1 id="vue-js-源码构建" tabindex="-1"><a class="header-anchor" href="#vue-js-源码构建" aria-hidden="true">#</a> Vue.js 源码构建</h1><p>Vue.js 源码是基于 rollup 构建的，它的构建相关配置都在 scripts 目录下。</p><h2 id="构建脚本" tabindex="-1"><a class="header-anchor" href="#构建脚本" aria-hidden="true">#</a> 构建脚本</h2><p>通常一个基于 NPM 托管的项目都会有一个 package.json 文件，它是对项目的描述文件，它的内容实际上是一个标准的 JSON 对象。</p><p>我们通常会配置 script 字段作为 NPM 的执行脚本，Vue.js 源码构建的脚本如下：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;script&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;node scripts/build.js&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;build:ssr&quot;</span><span class="token operator">:</span> <span class="token string">&quot;npm run build -- web-runtime-cjs,web-server-renderer&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;build:weex&quot;</span><span class="token operator">:</span> <span class="token string">&quot;npm run build -- weex&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),p=[o];function r(i,c){return n(),a("div",null,p)}const l=s(t,[["render",r],["__file","build.html.vue"]]);export{l as default};
