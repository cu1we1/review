## cookie,localStorage,sessionStorage 的区别

#### 相同点

cookie,locationStorage,sessionStorage 都是客户端保存数据用的，存储的数据类型都是 string

#### 不同点

1. 生命周期：

   1. cookie 如果不设置有效期，那么是会话级别的，会话结束后，cookie 随之清除，如果设置了有效期，那么会在有效期到了以后自动清除。

   2. localStorage 是永久的，除非主动删除。

   3. sessionStorage 仅在当前页面有效。sessionStorage 是在同源的窗口中始终存在的数据。只要这个浏览器窗口没有关闭，即使刷新或者进入另一个同源的页面，数据依然存在。但是 sessionStorage 在浏览器窗口关闭了以后就会消失。
      > 可以理解为:sessionStorage 是没有设置有效期的 cookie。
      > localStorage 是设置了有效期为永久的 cookie。

2. 网络流量：cookie 数据每次都会发送给服务端，而 localStorage 和 sessionStorage 不会与服务端进行通信，仅仅是为了保存数据。
3. 大小限制：cookie 大小限制在 4KB，非常小；localStorage 和 sessionStorage 在 5M。
4. 安全性：WebStorage(localStorage&sessionStorage)不会随着请求发送到服务端，所以安全性相对来说比较高。
5. 使用上： WebStorage(localStorage&sessionStorage)提供了一些方法，数据操作比 cookie 方便

   setItem(key, value) --- 保存数据，以键值对的方式

   getItem(key) --- 获取数据

   removeItem --- 删除单个 key 对应的数据

   clear() --- 删除所有数据

   key(index) --- 获取某个索引的 key
