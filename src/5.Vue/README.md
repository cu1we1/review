1. 说一下 Vue 的双向绑定。
   > vue 的双向绑定主要采用的是：数据劫持和发布者-订阅者模式完成的。具体是通过 Object.defineProperty()来劫持数据的 getter 和 setter 的，并且在触发的时候通知订阅者们，从而做到 data 到 view 的更新。而 view 到 data 的更新则可以通过事件绑定实现。
2. 对 MVC 和 MVVM 的理解。

   > M:代表 Model，数据模型。V:代表 View，视图，可以理解为和用户进行交互的部分。C:代表 Controller，控制器，即用来控制数据如何展示到视图上的，可以理解为将数据转换成 View 的转换器。VM:代表 ViewModel，它不同于 Controller 的区别在于，ViewModel 和 Model 是双向绑定的。

   MVC 模式：

   1. View 传送指令到 Controller。
   2. Controller 处理指令，即完成业务逻辑，控制数据完成更新。
   3. 数据完成更新。

   MVVM 模式：
   大致和 MVC 模式是一样的，唯一的区别是，它采用的是双向绑定：View 的变化，会自动同步到 ViewModel，反之亦然。

3. 介绍一下虚拟 DOM

   > 虚拟 DOM 是为了节省浏览器资源，降低 DOM 渲染、更新消耗而生的。

4. Vue 的生命周期。

- beforeCreate
- data
- created
- beforeMounte
- mounted
- beforeDestory
- destoryed

5. 组件通信。

> 父到子：props；子到父：$emit；

6. $route和$router 的区别

> $router为VueRouter实例，想要导航到不同的URL，使用$router.push 方法。
> $route 为当前 router 对象，可以获取到 name,path,query,params 等。

7. $nextTick 是做什么的

> this.$nextTick 的回调会在下次 DOM 更新结束以后进行回调。用于执行一些依赖于 DOM 更新的操作。

8. Vue 组件 data 为什么必须是函数

> 如果是一个对象，那么不同的组件实例之间会共享同一个对象，相互之前更新会影响，这很显然不是我们需要的。如果将 data 作为一个函数返回一个对象，那么每一个实例的 data 都是独立的，就不会相互影响了。

9. 对比 jQuery，Vue 有什么不同。

> jQuery 专注视图（View）层，通过操作 DOM 去实现页面的一些逻辑渲染；Vue 则专注于数据层，通过数据的双向绑定，最终表现在 DOM 层。并且引入了虚拟 DOM，在页面较为复杂的时候，极大节省了渲染性能消耗。

10. Vue 怎么定义指令。

> 全局注册

```javascript
Vue.direction("focus", {
  inserted: function (el) {
    el.focus();
  }
});
```

> 局部注册

```javascript
direction: {
   focus: {
      inserted: function(el) {
         el.focus();
      }
   }
}
```

11. Vue 里面 key 的作用。

> key 主要是在虚拟 DOM 的 Diff 时发挥作用。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

12. Vue 的核心是什么

> 数据驱动 组件系统
