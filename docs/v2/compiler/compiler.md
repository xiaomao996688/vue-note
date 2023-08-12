# 入口分析

当我们使用 runtime-compiler 版本作为入口的时候。进行挂载时会先调用$mount 函数, 然后调用 mount 方法之后会进行 mountComponent 方法进行挂载。

```js
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el, hydratingn) {
  el = el && query(el);
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  return mount.call(this, el, hydrating);
};
```

mountComponent 给当前实例创建一个渲染 Watcher。并返回当前的实例, 这个 vm 其实就是我们当时使用了 new Vue({}).$mount 之后的实例。

```js
export function mountComponent(vm, el, hydrating) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
  }
  callHook(vm, "beforeMount");

  let updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const startTag = `vue-perf-start:${id}`;
      const endTag = `vue-perf-end:${id}`;
      const vnode = vm._render();
      vm._update(vnode, hydrating);
    };
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}
```

挂载之前会查看是否有 render 函数，render 函数是用来返回虚拟 dom 的, 编译函数的入口就是这里。当数据发生变化的时候 vm.\_update(vm.\_render()),render 是返回的虚拟 DOM，update 会调用 patch 方法会更新 DOM。

```js
const { render, staticRenderFns } = compileToFunctions(
  template,
  {
    outputSourceRange: process.env.NODE_ENV !== "production",
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments,
  },
  this
);
```

compileToFunctions 把 template 编译生成 render 函数以及 staticRenderFns。它定义在 src/platforms/web/compiler/index.js 中。

```js
import { baseOptions } from "./options";
import { createCompiler } from "compiler/index";

const { compile, compileToFunctions } = createCompiler(baseOptions);

export { compile, compileToFunctions };
```

compileToFunctions 是 createCompiler 的返回值。baseOptions 是 createCompiler 的配置参数。

```js
export const createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
  const ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});
```

baseCompile 是真正处理 template 解析成抽象语法树和 render 函数的方法。

```js
export function createCompilerCreator(baseCompile) {
  return function createCompiler(baseOptions) {
    function compile(template, options) {
      const finalOptions = Object.create(baseOptions);
      const errors = [];
      const tips = [];

      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        if (
          process.env.NODE_ENV !== "production" &&
          options.outputSourceRange
        ) {
          // $flow-disable-line
          const leadingSpaceLength = template.match(/^\s*/)[0].length;

          warn = (msg, range, tip) => {
            const data = { msg };
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength;
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength;
              }
            }
            (tip ? tips : errors).push(data);
          };
        }
        // merge custom modules
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(
            options.modules
          );
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (const key in options) {
          if (key !== "modules" && key !== "directives") {
            finalOptions[key] = options[key];
          }
        }
      }

      finalOptions.warn = warn;

      const compiled = baseCompile(template.trim(), finalOptions);
      if (process.env.NODE_ENV !== "production") {
        detectErrors(compiled.ast, warn);
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled;
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile),
    };
  };
}
```

createCompilerCreator 返回的 createCompiler 方法,createCompiler 作用是接受了 baseOpions ,对 options 做加工，完成后再调用 baseCompile 方法进行代码编译。
compile 这里做也是被返回 了出去，执行 compile 就相当于是在帮助 baseCompile 处理 options 选项。

```js
const compiled = baseCompile(template.trim(), finalOptions);
```

baseCompile 接受要编译 vue 模版字符串，和配置参数，返回的是 { ast, render: code.render, staticRenderFns: code.staticRenderFns, };

```js
return {
  compile,
  compileToFunctions: createCompileToFunctionFn(compile),
};
```

最终返回是是 compile, compile 接受两个参数 template, options 然后去执行 baseCompile。

```js
export function createCompileToFunctionFn(compile) {
  const cache = Object.create(null);
  return function compileToFunctions(template, options, vm) {
    options = extend({}, options);
    const warn = options.warn || baseWarn;
    delete options.warn;

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production") {
      // detect possible CSP restriction
      try {
        new Function("return 1");
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            "It seems you are using the standalone build of Vue.js in an " +
              "environment with Content Security Policy that prohibits unsafe-eval. " +
              "The template compiler cannot work in this environment. Consider " +
              "relaxing the policy to allow unsafe-eval or pre-compiling your " +
              "templates into render functions."
          );
        }
      }
    }

    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key];
    }

    // compile
    const compiled = compile(template, options);

    // check compilation errors/tips
    if (process.env.NODE_ENV !== "production") {
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach((e) => {
            warn(
              `Error compiling template:\n\n${e.msg}\n\n` +
                generateCodeFrame(template, e.start, e.end),
              vm
            );
          });
        } else {
          warn(
            `Error compiling template:\n\n${template}\n\n` +
              compiled.errors.map((e) => `- ${e}`).join("\n") +
              "\n",
            vm
          );
        }
      }
      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach((e) => tip(e.msg, vm));
        } else {
          compiled.tips.forEach((msg) => tip(msg, vm));
        }
      }
    }
    // turn code into functions
    const res = {};
    const fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map((code) => {
      return createFunction(code, fnGenErrors);
    });

    if (process.env.NODE_ENV !== "production") {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
            fnGenErrors
              .map(({ err, code }) => `${err.toString()} in\n\n${code}\n`)
              .join("\n"),
          vm
        );
      }
    }

    return (cache[key] = res);
  };
}
```

createCompileToFunctionFn 是一个柯里化函数接受的参数其实 compile 方法 compile 方法其实返回的是
{ ast, render: code.render, staticRenderFns: code.staticRenderFns, errors，tips}，createCompileToFunctionFn 返回一个 compileToFunctions 的函数，方法是对编译完成的 compile 的返回对象做检查是否有错误提示，，createCompileToFunctionFn 核心代码如下：

```js
// turn code into functions
const res = {};
const fnGenErrors = [];
res.render = createFunction(compiled.render, fnGenErrors);
res.staticRenderFns = compiled.staticRenderFns.map((code) => {
  return createFunction(code, fnGenErrors);
});
```

拿到编译后的 render 方法，传入回调生成的错误数组，遍历 staticRenderFns 的所有代码转成函数。

```js
function createFunction(code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({ err, code });
    return noop;
  }
}
```

把字符串代码转成一个真正的函数返回。

## 总结
