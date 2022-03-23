Function.prototype.myBind = function (thisArg) {
  const context =
    typeof thisArg === "object" ? Object.assign({}, thisArg) : window;
  const temporary = Symbol("tem");
  context[temporary] = this;
  return function (...args) {
    context[temporary](...args);
  };
};
