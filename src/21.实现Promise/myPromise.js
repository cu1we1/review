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

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("sucess");
  }, 3000);
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
