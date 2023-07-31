# Vue.js 源码构建

Vue.js 源码是基于 rollup 构建的，它的构建相关配置都在 scripts 目录下。

## 构建脚本

通常一个基于 NPM 托管的项目都会有一个 package.json 文件，它是对项目的描述文件，它的内容实际上是一个标准的 JSON 对象。

我们通常会配置 script 字段作为 NPM 的执行脚本，Vue.js 源码构建的脚本如下：

```json
{
  "script": {
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex"
  }
}
```
