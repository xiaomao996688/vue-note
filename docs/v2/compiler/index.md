# 模版编译

Vue2.x 介绍入口文件时，runtime 版本，只包含运行代码，不包括编译代码，是依赖自动化工具中 vue-loader 来编译.vue 结尾的文件。另一种是 runtime-compiler 来进行编译，生成 render 函数。

挂载时会调用$mount, 会进行判断是否有 render 方法和 template 或者 el 元素。通过把 template 或者 el 转成字符串 ，在通过 parse 方法把 html 转成 ast，再 ast 转成 render 方法实际返回的是当前编译模版后的虚拟 DOM。

<img :src="$withBase('../assets/v2/parse.png')" alt="">
