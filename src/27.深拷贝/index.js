/**
 *
 * 1.基础数据类型
 * 2.引用数据类型Array，Object，Function，Date
 *
 *
 */

function deepClone(originData) {
  if (typeof originData !== "object") return originData;
  if (Object.prototype.toString.call(originData) === "[object Function]") {
    return originData.bind(this);
  } else if (Object.prototype.toString.call(originData) === "[object Object]") {
    const resultObj = {};
    for (let key in originData) {
      resultObj[key] = deepClone(originData[key]);
    }
    return resultObj;
  } else if (Object.prototype.toString.call(originData) === "[object Array]") {
    const resultArr = [];
    for (let i = 0, len = originData.length; i < len; i++) {
      resultArr.push(deepClone(originData[i]));
    }
    return resultArr;
  } else if (Object.prototype.toString.call(originData) === "[object Null]") {
    return null;
  }
  return undefined;
}
