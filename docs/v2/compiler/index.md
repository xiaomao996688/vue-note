# 模版编译

之前介绍 挂载时会拿到 template 模版作为参数传递 compileToFunctions 会返回 render 方法来添加到 vue 的实例上。render 方法实际返回的是当前编译模版后的虚拟 DOM。我们可以直接编写 render 函数，但是 vue 给我们提供了 template，这样写模版更加直观。

Vue2.x 之前介绍入口文件时，runtime 版本，只包含运行代码，不包括编译代码，是依赖自动化工具中 vue-loader 来编译.vue 结尾的文件。另一种是 runtime-compiler 来进行编译，生成 render 函数。
