### 手写防抖和截流

#### 防抖

> 事件被触犯 timer 时间后再执行，如果在 timer 时间段内又被触发了，那么会重新计时。

```javascript
function debounce(fn, time) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    const _this = this;
    const args = arguments;
    timer = setTimeout(() => {
      fn().apply(_this, args);
    }, time);
  };
}
```

#### 截流

> 一段时间内，只会触发一次。

```javascript
function throttle(fn, time) {
  let timer;
  return function () {
    if (timer) return;
    const _this = this;
    const args = arguments;
    timer = setTimeout(() => {
      fn().apply(_this, args);
      timer = null;
    }, time);
  };
}
```
