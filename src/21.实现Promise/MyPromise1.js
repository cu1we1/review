function MyPromise(fn) {
  this.PromiseState = "pending";
  this.PromiseResult = undefined;
  const resolve = value => {};

  const reject = error => {};

  if (fn && typeof fn === "function") {
    fn(resolve, reject);
  } else {
    throw "必须传入执行器函数！";
  }
}

let p = new MyPromise(function (resolve, reject) {});
console.log(p);
p.then(res => {
  console.log(res);
});
