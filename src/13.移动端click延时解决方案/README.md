## 移动端 click 延时解决方案

原因分析：移动端 click 事件会有 300ms 的延时，是由于移动端屏幕双击会进行缩放。

解决方案：

1. 禁用缩放

```html
<meta name="viewport" content="user-scalable=no" />
```

2. 利用 touch 事件自己封装 click 事件。
