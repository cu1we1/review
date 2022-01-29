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

- promise 返回值为一个 promise 对象，并且每个 promise 都有一个 promiseResult

- 执行器：promise 执行入口（传入 Promise 对象的函数，同步代码）

- resolve：改变 promise 状态为 fulfilled

- reject：改变 promise 状态为 rejected

- then：接收两个函数，onFulfilled, onRejected。分别在 promise 状态变为 fulfiled 和 rejected 后执行

- 如果 onFulfilled 和 onRejected 不是函数，或者不传，那么将会把上一步的 value 进行向后传递。

- then 必须返回一个 promise 对象，支持链式调用

- catch：接受一个回调，在 promise 状态变为 rejected 后执行

- promise 状态变为 rejected 后，将直接执行最短路径的 catch

- catch 也返回的是一个 promise 对象，并且支持继续链式调用

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

再来第二个：

```js
const pending = "pending",
  fulfilled = "fulfilled",
  rejected = "rejected";

function MyPromise(fn) {
  const _this = this;
  this.state = pending;
  this.value;
  this.reason;
  this.onFulfilled = [];
  this.onRejected = [];
  function resolve(value) {
    if (_this.state === pending) {
      _this.state = fulfilled;
      _this.value = value;
      _this.onFulfilled.forEach(item => item(value));
    }
  }
  function reject(reason) {
    if (_this.state === pending) {
      _this.state = rejected;
      _this.reason = reason;
      _this.onRejected.forEach(item => item(reason));
    }
  }
  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("Chaining cycle"));
  }
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let used;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (used) return;
            resolve(y);
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (used) return;
            used = true;
            reject(r);
          }
        );
      } else {
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (error) {
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const _this = this;
  const thenOnFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : value => value;
  const thenOnRejected =
    typeof onRejected === "function"
      ? onRejected
      : reason => {
          throw reason;
        };
  let promiseThen = new MyPromise((resolve, reject) => {
    if (_this.state === fulfilled) {
      setTimeout(() => {
        try {
          let x = thenOnFulfilled(_this.value);
          resolvePromise(promiseThen, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    } else if (_this.state === rejected) {
      setTimeout(() => {
        try {
          let x = thenOnRejected(_this.reason);
          resolvePromise(promiseThen, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    } else if (_this.state === pending) {
      _this.onFulfilled.push(() => {
        setTimeout(() => {
          try {
            let x = thenOnFulfilled(_this.value);
            resolvePromise(promiseThen, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      _this.onRejected.push(() => {
        setTimeout(() => {
          try {
            let x = thenOnRejected(_this.reason);
            resolvePromise(promiseThen, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  });
  return promiseThen;
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
