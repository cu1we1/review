# 回流和重绘（Reflow&Repaing）,以及如何进行优化？

### 回流（Reflow）

当渲染树`reander tree`中的一部分（或全部）因为元素的尺寸，布局，隐藏等改变而需要重新构建。这就称为回流。每个页面至少要进行一次回流，就是在页面第一次加载的时候，因为要构建 `render tree`。完成回流以后，生成了新的`render tree`，然后浏览器会重新绘制受影响的部分到屏幕中，改过程称为`重绘`。

### 重绘（Repaint）

当渲染树`render tree`中的一些元素需要更新样式，但这些样式属性只是改变元素的外观，风格，不会影响布局，即`render tree`不会重新生成，那么这个过程称为`重绘`。

### 为什么不建议频繁的操作 DOM？

操作 DOM 是很消耗性能的，所以我们`不仅要避免去操作DOM，还要减少访问DOM的次数。`

因为在浏览器中，DOM 和 JS 的实现，并不是在同一个引擎中完成的。DOM 是属于渲染引擎中的东西，而 JS 又是 JS 引擎的。当我们通过 JS 操作 DOM 的时候，就涉及到了两个线程之间的通信，那么势必会带来一些性能上的损耗。

引用一句话：`把DOM和JavaScript各自想象成一个岛屿，他们之间用收费的桥梁连接`

### 会导致回流的操作：

- 页面首次渲染（无法避免且开销最大的一次）
- 浏览器窗口大小发生改变（触发 window 上的 resize 事件）
- 元素尺寸或者位置发生改变（边距，宽高，边框等）
- 元素内容变化（文字数量或图片大小等）
- 元素字体大小发生变化（font-size）
- 添加或者删除`可见`的 DOM 元素
- 激活 css 伪类
- 查询某些属性或调用方法

#### 会导致回流的属性和方法

    width height margin padding
    display border-width border position
    overflow font-size vertical-align min-height
    clientWidth clientHeight clientTop clientLeft
    offsetWidth offsetHeight offsetTop offsetLeft
    scrollWidth scrollHeight scrollTop scrollLeft

    scrollIntoView() scrollTo() getComputedStyle()
    getBoundingClientRect() scrollIntoViewIfNeeded()

### 为什么获取一些属性或调用方法也会导致回流？

因为以上的属性和方法都需要返回最新的布局信息，因此浏览器不得不出发回流重绘来返回最新的值。

### 会导致重绘的属性

    color border-style visibility background
    text-decoration background-image background-position background-repeat
    outline-color outline outline-style border-radius
    outline-width box-shadow background-size

[具体可以在 CSS Triggers 查询](https://csstriggers.com/)

### 浏览器自身的优化机制

由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才会进行批量修改并清空队列。但是，`在获取布局信息的时候，会强制刷新队列`，比如当你访问了以下属性或者使用以下方法：

- clientTop, clientLeft, clientWidth, clientHeight
- offsetTop, offsetLeft, offsetWidth, offsetHeight
- scrollTop, scrollLeft, scrollWidth, scrollHeight
- getComputedStyle()
- getBoundingClientRect()

以上属性和方法都需要浏览器返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，`最好避免使用上面列出的属性，他们都会刷新渲染队列`

### 如何减少回流和重绘？（优化）

1. 合并对 DOM 样式的修改

```js
const dom = document.querySelector(".box");
el.style.margin = "5px";
el.style.borderRadius = "12px";
el.style.boxShadow = "1px 3px 4px #ccc";
```

可以改成

```css
.update {
  margin: 5px;
  border-dadius: 12px;
  box-shadow: 1px 3px 4px #ccc;
}
```

```js
const el = document.querySelector(".box");
el.classList.add("update");
```

2. 如果需要对 DOM 进行多次访问，尽量使用局部变量缓存该 DOM

3. 避免使用 table 布局，可能很小的一个改动会造成整个 table 的重新布局

4. css 尽可能扁平化，css 选择符从右往左匹配查找，避免节点层级过多

5. DOM 离线处理，减少回流重绘次数。

   使用`display: none;`上面我们说到了 (display: none) 将元素从渲染树中完全移除，元素既不可见，也不是布局的组成部分，之后在该 DOM 上的操作不会触发回流与重绘，操作完之后再将 display 属性改为显示，只会触发这一次回流与重绘。

   `visibility: hidden;的元素只会重绘有影响，不影响重排`

6. DOM 脱离普通文档流

7. CSS3 硬件加速（GPU 加速）

   使用 css3 硬件加速，可以让`transform,opacity,filter`这些动画不会引起回流重绘。但是对于动画的其他属性，比如`background-color`这些，还是会引起回流重绘的，不过硬件加速还是可以提升这些动画的性能的。
   可以触发硬件加速的 CSS 属性：

   - transform
   - opacity
   - filters
   - Will-change

8. 将节点设置为图层

   图层可以阻止该节点的渲染行为影响到别的节点。比如对于 video 标签来说，浏览器会自动将该节点变为图层。
