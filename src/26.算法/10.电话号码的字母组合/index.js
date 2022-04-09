/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  const map = new Map([
    ["2", ["a", "b", "c"]],
    ["3", ["d", "e", "f"]],
    ["4", ["g", "h", "i"]],
    ["5", ["j", "k", "l"]],
    ["6", ["m", "n", "o"]],
    ["7", ["p", "q", "r", "s"]],
    ["8", ["t", "u", "v"]],
    ["9", ["w", "x", "y", "z"]]
  ]);
  const numsList = [];
  for (let i = 0, len = digits.length; i < len; i++) {
    numsList.push(map.get(digits[i]));
  }
};

function format(list) {
  if (list.length === 2) {
    // do something
  } else {
    format([list[0], list.slice(1)]);
  }
}
