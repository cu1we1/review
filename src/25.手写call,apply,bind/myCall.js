Function.prototype.myCall = function (thisArg, ...args) {
  const context = typeof thisArg === "object" ? thisArg : window;
  const temporary = Symbol("tem");
  context[temporary] = this;
  const result = context[temporary](...args);
  delete context[temporary];
  return result;
};
