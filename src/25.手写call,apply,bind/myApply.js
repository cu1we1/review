Function.prototype.myApply = function (thisArg, argList) {
  const context = typeof thisArg === "object" ? thisArg : window;
  const temporary = Symbol("tem");
  context[temporary] = this;
  const result = context[temporary](...argList);
  delete context[temporary];
  return result;
};
