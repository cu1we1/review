### ES6 新增方法

#### 1. String.fromCodePoint();

> String.fromCodePoint 静态方法返回使用指定的代码点序列创建的字符串。它是一个原型方法。

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

#### 2. String.prototype.includes();

> String.prototype.includes()方法用于判断一个字符串是否包含在另一个字符串中，根据情况返回 true 或者 false。是一个实例方案。

参数：

```javascript
/**
 * searchString 需要比对的字符串
 * positon 比对的起始位置
 **/
String.prototype.includes(searchString, positon);
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

#### 3. String.prototype.startsWith();

> String.prototype.startsWith()方法用于判断当前字符串是否以另一个给定的字符串开头，兵根据判断结果返回 true 或 false。是一个实例方法。

实例

```javascript
"cuiwei".startsWith("cui");
// true
"cuiwei".startsWith("we");
// false
"cuiwei".startsWith("we", 3);
// true
```

#### 4. String.prototype.endsWith();

> String.prototype.endsWith()方法判断当前字符串是否是以另一个给定的字符串结尾的，返回 true 或 false。是一个实例方法。

参数：

```javascript
/**
 * searchString 需要比对的字符串
 * length 比对的searchString长度。
 **/
String.prototype.endsWith(searchString, length);
```

实例

```javascript
"cuiwei".endsWith("wei");
// true
"cuiwei".endsWith("we", 5);
// true
"cuiwei".endsWith("u", 2);
```

#### 5. String.prototype.padStart();

> String.prototype.padStart()方法用另一个字符串填充当前字符串（如果需要的话，会重复多次），以便产生的字符串达到给定的长度。从当前字符串左侧开始填充。

参数

```javascript
/**
 * targetLength 目标字符串长度，如果这个数值小于当前字符串的长度，则返回当前字符串本身。
 * padString 填充的字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断。参数默认值为""。
 * */
String.prototype.padStart(targetLength, padString);
```

实例

```javascript
"cuiwei".padStart(11, "yanrou");
// 'yanrocuiwei'
"cuiwei".padStart(2, "yanrou");
// 'cuiwei'
"cuiwei".padStart(22);
// '                cuiwei'
```

#### 6. String.prototype.padEnd();

> String.prototype.padEnd()方法功能和 String.prototype.padStart()一样，区别在于此方法从当前字符串右侧开始填充。

实例

```javascript
"cuiwei".padEnd(10, "yanrou");
// 'cuiweiyanr'
"cuiwei".padEnd(1, "yanrou");
// 'cuiwei'
```

#### 7. String.prototype.trim();

> String.prototype.trim();方法会从一个字符串的两端删除空白符。

#### 8. String.prototype.trimEnd()/String.prototype.trimRight();

> String.prototype.trim();方法会从一个字符串的末端删除空白符。

#### 9. String.prototype.trimStart()/String.prototype.trimLeft();

> String.prototype.trim();方法会从一个字符串的开端删除空白符。

#### 10. String.prototype.concat();

> 此方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。

实例

```javascript
"cuiwei".concat("yanrou", "123");
// 'cuiweiyanrou123'
```
