/**
 *
 * 1.基础数据类型
 * 2.引用数据类型Array，Object，Function，Date
 *
 *
 */

function deepClone(originData, map = new Map()) {
  if (!(typeof originData === "object" || typeof originData === "function"))
    return originData;
  if (Object.prototype.toString.call(originData) === "[object Function]") {
    const resultFn = originData.bind({});
    for (const key in originData) {
      if (Object.prototype.hasOwnProperty.call(originData, key)) {
        resultFn[key] = deepClone(originData[key], map);
      }
    }
    return resultFn;
  } else if (Object.prototype.toString.call(originData) === "[object Object]") {
    const resultObj = {};
    for (let key in originData) {
      if (!map.get(key)) {
        map.set(key, originData[key]);
        resultObj[key] = deepClone(originData[key], map);
      } else {
        resultObj[key] = map.get(key);
      }
    }
    return resultObj;
  } else if (Object.prototype.toString.call(originData) === "[object Array]") {
    const resultArr = [];
    for (let i = 0, len = originData.length; i < len; i++) {
      resultArr.push(deepClone(originData[i], map));
    }
    return resultArr;
  } else if (Object.prototype.toString.call(originData) === "[object Null]") {
    return null;
  }
  return undefined;
}
