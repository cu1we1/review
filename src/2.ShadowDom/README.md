## 影子 DOM(Shadow Dom)

Web components 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。

> 备注： Firefox（从版本 63 开始），Chrome，Opera 和 Safari 默认支持 Shadow DOM。基于 Chromium 的新 Edge 也支持 Shadow DOM；而旧 Edge 未能撑到支持此特性。
