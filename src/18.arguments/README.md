### arguments

`arguments`是一个对应于传递给函数的**参数**的**类数组对象**。

MDN Note：

> If you're writing ES6 compatible code, then rest parameters should be preferred.
>
> > 如果您正在编写与 ES6 兼容的代码，那么 [rest](../17.剩余参数/README.md) 参数应该是首选。

> “Array-like” means that arguments has a length property and properties indexed from zero, but it doesn't have Array's built-in methods like forEach() and map().
>
> > “类数组”意味着参数有一个长度属性和从 0 开始索引的属性，但它没有数组的内置方法，如 forEach()和 map()。

```javascript
function fun(a, b, c) {
  console.log(arguments);
}
fun(1, 2, 3);
// Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]

const fun2 = (a, b, c) => {
  console.log(arguments);
};
fun2(1, 2, 3);
// Uncaught ReferenceError: arguments is not defined
```

`arguments`对象是所有函数（非箭头函数）中都可以直接使用的**局部变量**。它是一个**类数组**。

#### arguments 的类型

```javascript
function fun(a, b) {
  console.log(typeof arguments);
  console.log(Object.prototype.toString.call(arguments));
}
fun(1, 2):
// object
// [object Arguments]
```

#### arguments 对象的属性

`arguments.callee`

    指向参数所属的当前函数
    指向调用当前函数的函数

`arguments.length`

`arguments[@@iterator]`
