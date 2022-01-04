## CommonJS原理解析

本篇内容不对CommonJS的基础用法做阐述，只简单剖析一下CommonJS的原理。

>CommonJS规范主要用于nodejs。

#### 一、node模块只会在第一次加载时运行，之后加载都是直接获取缓存（到处对象）。
```javascript
// a.js
console.log('a');

// b.js
require('./a.js');

// c.js
require('./a.js');
require('./b.js');
```
```javascript
node c.js
// 输出 a
```
虽然导入了两次a.js，但是结果只有打印了一次a。

Node的模块 实际上可以理解为代码被包裹在一个函数包装器内
一个简单的require demo：
```javascript
function wrapper (script) {
    return '(function (exports, require, module, __filename, __dirname) {' + 
        script +
     '\n})'
}

function require(id) {
 var cachedModule = Module._cache[id];
  if(cachedModule){
    return cachedModule.exports;
  }
  
  const module = { exports: {} }

  // 这里先将引用加入缓存 后面循环引用会说到
  Module._cache[id] = module

  //当然不是eval这么简单
  eval(wrapper('module.exports = "123"'))(module.exports, require, module, 'filename', 'dirname')

  return module.exports
}
```
从以上代码我们可以知道：

1. 模块只执行一次，之后调用获取的 module.exports 都是缓存
2. 模块导出就是return这个变量的其实跟a = b赋值一样， 基本类型导出的是值， 引用类型导出的是引用地址
3. exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports， 所以对exports进行赋值会导致exports操作的不再是module.exports的引用

以上三点我们逐一分析一下：

> 1. 模块只执行一次，之后调用获取的 module.exports 都是缓存

这一点我们最开始的例子就可以很好的说明问题了，我们虽然导入了两次a.js，但是结果只有打印了一次a。就可以说明a.js模块只被执行了一次。

> 2. 模块导出就是return这个变量的其实跟a = b赋值一样， 基本类型导出的是值， 引用类型导出的是引用地址

这个很好理解，直接看例子：
```javascript
// a.js
module.exports.a = {
  name: "1"
};
// b.js
const { a } = require("./a.js");
console.log("b.js-", a);
// main.js
const { a } = require("./a.js");
console.log("main.js-", a);
a.name = "2";
require("./b.js");
```
```javascript
node main.js
/**
 * main.js- { name: '1' }
 * b.js- { name: '2' } 
*/
```
再看：
```javascript
// a.js
var a = 1;
module.exports.a = a;
// b.js
const { a } = require("./a.js");
console.log("b.js-", a);
// main.js
const { a } = require("./a.js");
console.log("main.js-", a);
a = 2;
require("./b.js");
```
```javascript
node main.js
/**
 * main.js- 1
 * TypeError: Assignment to constant variable. 
*/
```
由上面的列子可见，当导出是一个基本类型值的时候，node不允许我们修改导出值。
> 3. exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports， 所以对exports进行赋值会导致exports操作的不再是module.exports的引用

这一点其实很好理解，我们看下面的代码：
```javascript
// a.js
const a = 1;
module.exports.a = a;
exports = { a: 2 };
// main.js
const { a } = require("./a.js");
console.log(a);
```
```javascript
node main.js
// 输出 1
```
有同学可能会问，会不会和module.exports与exports的顺序有关，好的，我们实验一下：
```javascript
// a.js
const a = 1;
exports = { a: 2 };
module.exports.a = a;
// main.js
const { a } = require("./a.js");
console.log(a);
```
```javascript
node main.js
// 输出 1
```
再来：
```javascript
// a.js
const a = 1;
module.exports.a = a;
exports.a = 3;
// main.js
const { a } = require("./a.js");
console.log(a);
```
```javascript
node main.js
// 输出 3
```
AND：
```javascript
// a.js
const a = 1;
exports.a = 3;
module.exports.a = a;
// main.js
const { a } = require("./a.js");
console.log(a);
```
```javascript
node main.js
// 输出 1
```
上面的例子已经很能说明问题了。

#### 二、node 模块的导出不是动态绑定的。

对于这点，我们先看一下ES6 Module的动态绑定是怎么回事：
```javascript
// a.js
let counter = 0;
function incCounter() {
  counter++;
}

export { counter, incCounter };

// main.js
import { counter, incCounter } from "./a.js";

console.log(counter);
incCounter();
console.log(counter);
```
```javascript
node main.js
// 0
// 1
```

很明显，a.js 中变量 counter 的变化映射到了 main.js，相反在CommonJS里面：
```javascript
// a.js
let counter = 0;
function incCounter() {
  counter++;
}

module.exports = { counter, incCounter };

// main.js
const { counter, incCounter } = require("./a.js");

console.log(counter);
incCounter();
console.log(counter);
```
```javascript
node main.js
// 0
// 0
```
打印结果都是0，那么我们有没有办法在CommonJS里面让counter响应变化呢？答案是肯定的，来：
```javascript
// a.js
let number = 0;
function incCounter() {
  number++;
}

module.exports = {
  counter: function () {
    return number;
  },
  incCounter,
  number
};
// main.js
const { counter, incCounter, number } = require("./a.js");

console.log(counter(), number);
incCounter();
console.log(counter(), number);
```
```javascript
node main.js
// 0 0
// 1 0
```
