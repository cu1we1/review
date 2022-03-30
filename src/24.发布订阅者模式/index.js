class MySub {
  constructor() {
    /**
     * {
     *  test: [fn1, fn2]
     * }
     *
     */
    this.listener = {};
  }
  //   订阅
  on(eventName, fn) {
    if (!eventName || typeof fn !== "function") return;
    if (Array.isArray(this.listener[eventName])) {
      this.listener[eventName].push(fn);
    } else {
      this.listener[eventName] = [fn];
    }
  }
  //   发布
  emit(eventName, ...args) {
    if (!eventName) return;
    const _this = this;
    if (Array.isArray(this.listener[eventName])) {
      this.listener.forEach(item => {
        // typeof item === "function" && fn.call(_this, ...args);
        typeof item === "function" && fn.apply(_this, args);
      });
    }
  }
}
