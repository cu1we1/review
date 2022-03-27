/**
 */
var longestCommonPrefix = function (strs) {
  const map = [],
    firstItem = strs[0];
  for (let j = 0, firstItemLen = firstItem.length; j < firstItemLen; j++) {
    firstItem[j] && map.push(firstItem[j]);
  }
  for (let i = 0, len = strs.length; i < len; i++) {
    map.splice(strs[i].length);
    const item = strs[i];
    for (let k = 0, itemLen = item.length; k < itemLen; k++) {
      if (map[k] !== item[k]) {
        map.splice(k);
      }
    }
  }
  return map.join("");
};
