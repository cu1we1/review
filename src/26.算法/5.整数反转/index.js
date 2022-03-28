/**
 */
var reverse = function (x) {
  const strNum = `${x}`;
  let len = strNum.length;
  const symbol = strNum[0] === "+" || strNum[0] === "-" ? strNum[0] : "";
  let result = "";
  for (let i = 0; i < len; i++) {
    if (symbol && i === 0) continue;
    result = strNum[i] + result;
  }

  if (
    Number(`${symbol}${result}`) <= -Math.pow(2, 31) ||
    Number(`${symbol}${result}`) >= Math.pow(2, 31) - 1
  )
    return 0;
  return Number(`${symbol}${result}`);
};
