### 剩余参数

剩余参数预发允许我们将一个不定数量的参数表示为一个数组

#### 剩余参数和 arguments 对象的区别

- 剩余参数只包含那些**没有对应形参的实参**，而`arguments`对象包含了传给函数的**所有实参**。
- `arguments`对象不是一个真正的数组，而剩余参数是真正的`Array`实例，也就是说可以在剩余参数数组上使用所有数组的实例方法。`arguments`可以通过`Array.prototype.slice.call(arguments)`转成真数组，从而使用数组的实例方法。
- `arguments`对象还有一些附加属性：`callee`属性。

```javascript
function test(a, b, ...rest) {
  console.log(a, b, rest);
}
test(1); // 1 undefined []
test(1, 2); //1 2 []
test(1, 2, 3); // 1 2 [3]
test(1, 2, 3, 4, 5, 6); // 1 2 [3, 4, 5, 6]
```
