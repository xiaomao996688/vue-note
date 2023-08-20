# parse

进行编译是会把创建编译方法是用来执行解析 template 模版字符串的方法。parse 是核心代码。

<img :src="$withBase('../assets/v2/parseHtml.png')" alt="">

parse 方法中保存了 root 是当前要返回的 ast 树。stack 来存储接解析到元素。源代码太复杂了，我用官方的写了一个简易版本的,方便理解。closeElement 是用来处理结束标签。start 用来处理 html 标签的开始标签，把解析到的 astElement 放入 stack 中。end 解析到 html 的标签时开始出栈，形成 ast 树。chars 解析到文字或者{{}}表达式。这时简易版的，当然也会去处理复杂的指令。

```js
function parse(html) {
  var root;
  var currentParent;
  var stack = [];
  function closeElement(element) {
    currentParent.children.push(element);
    element.parent = currentParent;
  }
  HTMLParser(html, {
    start: function (tag, attrs, unary) {
      var element = createAstElement(tag, attrs, currentParent);
      if (!root) {
        root = element;
      }
      currentParent = element;
      stack.push(element);
    },
    end: function (tag) {
      var element = stack[stack.length - 1];
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      if (!currentParent) {
        return;
      }
      closeElement(element);
    },
    chars: function (text) {
      var children = currentParent.children;
      var child = {
        type: 2,
        text,
      };
      children.push(child);
    },
  });
  return {
    currentParent,
    root,
    stack,
  };
}
```

## parseHTML

上面讲了解析到的标签转成字符串，下面讲的是如何把 html 字符串转成标签，内容。这个被我简化的例子写的很明白。遍历到一个标签就截取剩下的 html 字符串。然后继续下次循环截取直到 html 字符串被截取为空字符串。遇到\<开头的就检测是否是开始标签，检测到结束标签就开始检测出栈。

```js
var startTag = /^<([\w\.\-]+)>/,
  endTag = /^<\/([\w\.\-]+)[^>]*>/;
function HTMLParser(html, handler) {
  var index,
    chars,
    match,
    stack = [],
    last = html;
  stack.last = function () {
    return this[this.length - 1];
  };
  while (html) {
    chars = true;
    // special 是一个空map， stack.last最开始是空的
    if (!stack.last() || !special[stack.last()]) {
      if (html.indexOf("<") == 0) {
        match = html.match(startTag);
        if (match) {
          html = html.substring(match[0].length);
          // match[0].replace(startTag, parseStartTag);
          handler.start(match[1], [], false);
          chars = false;
        }
      }
      // 结束标签
      if (html.indexOf("</") == 0) {
        match = html.match(endTag);
        if (match) {
          html = html.substring(match[0].length);
          // match[0].replace(endTag, parseEndTag);
          handler.end(stack.pop);
          chars = false;
        }
      }
      // 文字处理
      if (chars) {
        index = html.indexOf("<");
        var text = index < 0 ? html : html.substring(0, index);
        html = index < 0 ? "" : html.substring(index);
        if (handler.chars) handler.chars(text);
      }
      // 不是第一次
    }
    if (html == last) {
      throw "Parse Error: " + html;
    }
    last = html;
  }
}
```

## 总结

parse 方法解析 template 模版字符串主要用的是 html 字符串截取的方法，然后把截取的字符串根据规则生存 ast 树返回。
