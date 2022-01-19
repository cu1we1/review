### ES6 新增方法

#### 1. String.fromCodePoint();

> String.fromCodePoint 静态方法返回使用指定的代码点序列创建的字符串。

```javascript
String.formCodePoint(9731, 9733, 9842, 0x2f804);
// '☃★♲你'
```

如果传入一个无效的 Unicode 编码，那么会返回一个 RangeError

```javascript
String.fromCodePoint(9731111);
/**
 * VM5701:1 Uncaught RangeError: Invalid code point 9731111
 *  at Function.fromCodePoint (<anonymous>)
 *   at <anonymous>:1:8
 * /
```

#### 2.String.includes();

> String.includes()方法用于判断一个字符串是否包含在另一个字符串中，根据情况返回 true 或者 false。

参数：

```javascript
/**
 * searchString 需要比对的字符串
 * positon 比对的起始位置
 * /
String.inclues(searchString, positon);
```

实例

```javascript
"cuiwei".includes("cuiwei", 0);
// true
"cuiwei".includes("cuiwei", 1);
// false
"cuiwei".includes("wei", 0);
// true
"cuiwei".includes("wei", 3);
// true
"cuiwei".includes("wei", 4);
// false
```
