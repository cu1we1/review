## 从零开始手撸一个 Promise

### 1. 分析 Promise 对象

我们先看一个普通的 Promise 对象：

```js
new Promise(function(resolve, reject) {
    if(/* 异步操作成功 */) {
        resolve(value);
    } else {
        reject(error);
    }
}).then(res => {
    // success
}, error => {
    fail
}).catch(err => {
    // fail
})
```

从上面的例子可以看出，`Promise`具有以下特点：

- pormise 状态：pending,fulfilled,rejected

- promise 返回值

- 执行器：promise 执行入口（传入 Promise 对象的函数，同步代码）

- resolve：改变 promise 状态为 fulfilled

- reject：改变 promise 状态为 rejected

- then：接收两个函数，onFulfilled, onRejected。分别在 promise 状态变为 fulfiled 和 rejected 后执行

- catch：接受一个回调，在 promise 状态变为 rejected 后执行

### 2. 实现 MyPromise。

先来第一个：

```js
function MyPromise(fn) {
  this.promiseState = "pending";
  this.promiseValue;
  this.catchCallback;
  const _this = this;
  const resolve = function (value) {
    if (_this.promiseState === "pending") {
      _this.promiseState = "fulfiled";
      _this.promiseValue = value;
      if (value instanceof MyPromise) {
        value.then(function (res) {
          _this.thenCallback(res);
        });
      } else {
        setTimeout(() => {
          if (_this.thenCallback) {
            _this.thenCallback(value);
          }
        });
      }
    }
  };
  const reject = function (value) {
    if (_this.promiseState === "pending") {
      _this.promiseState = "rejected";
      _this.promiseValue = value;
      setTimeout(() => {
        if (_this.catchCallback) {
          _this.catchCallback(value);
        } else if (_this.thenCallback) {
          _this.thenCallback(value);
        } else {
          throw "promise状态变为reject了，但是没有catch";
        }
      });
    }
  };
  if (fn) {
    fn(resolve, reject);
  } else {
    throw "错误";
  }
}

MyPromise.prototype.then = function (callback) {
  const _this = this;
  return new MyPromise((resolve, reject) => {
    _this.thenCallback = function (value) {
      if (_this.promiseState === "reject") {
        reject();
      } else {
        const callBackRes = callback(value);
        if (callBackRes instanceof MyPromise) {
          if (callBackRes.promiseState === "rejected") {
            setTimeout(() => {
              if (_this.catchCallback) {
                _this.catchCallback(callBackRes.promiseValue);
              }
            });
          }
        } else {
          resolve(callBackRes);
        }
      }
    };
  });
};

MyPromise.prototype.catch = function (callback) {
  const _this = this;
  return new MyPromise(function (resolve, reject) {
    _this.catchCallback = function (err) {
      const callBackRes = callback(err);
      resolve(callBackRes);
    };
  });
};
```

### 3. 我们来分析一下上面的`MyPromise`有什么问题：

1. reject 触发问题。_**catch 没有办法直接跳过 then 直接触发**_

```js
new MyPromise((resolve, reject) => {
  reject("failed");
})
  .then(res => {
    console.log("then1", res);
    return "123";
  })
  .then(res => {
    console.log("then2", res);
  })
  .catch(err => {
    console.log(err);
  });

/*
then1 failed
then2 123
*/
```

2._**还未支持`静态方法`**_

- Promise.all
- Promise.race
- Promise.reject
- Promise.resolve

### 4.逐一解决上述问题

1.catch 没有办法直接跳过 then 直接触发
