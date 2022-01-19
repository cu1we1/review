### bind,apply,call 的区别

#### 相同点

> 都是用于改变函数内部 this 指向的。

#### 不同点

1. call

- 用法实例

```javascript
call(this, arg1, arg2, arg3, ....);
```

第一个参数为新的 this 指向，之后参数会按照顺序传递给原函数，并且原函数会立即执行，返回执行结果。

- 应用

```javascript
Math.max.call({}, 1, 2, 3, 4);
// 4
// 类数组转换成数组
Array.prototype.slice.call(document.getElementsByClassName("card_box"));
```

2. bind

- 用法实例

```javascript
bind(this);
```

参数为新的 this 指向，并且调用以后会返回一个修改了 this 指向的新函数。bind 会创建一个新函数，这个新的函数不管怎么调用都会有同样的 this。

- 应用

```javascript
Math.max.bind({}, 1, 2, 3, 4)();
// 4
Math.max.bind({}, 1, 2, 3, 4)(5);
// 5
// 类数组转换成数组
Array.prototype.slice.apply(document.getElementsByClassName("card_box"));
```

3. apply

- 用法实例

```javascript
apply(this, [arg1, arg2, arg3, ...])
```

第一个参数为新的 this 指向，第二个参数为一个数组，数组元素为传递给原函数的参数，并且原函数会立即执行，返回执行结果。

- 应用

```javascript
const a = [1, 2, 3, 4, 5];
Math.max.apply({}, a);
// 5
```
