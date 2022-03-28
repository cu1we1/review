/**
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
function isPalindrome(x) {
  const str = x + "";
  const count = Math.ceil(str.length / 2);
  let leftIndex = 0,
    rightIndex = str.length - 1;
  for (let i = 0; i < count; ++i) {
    if (str[leftIndex] !== str[rightIndex]) {
      return false;
    } else {
      leftIndex += 1;
      rightIndex -= 1;
    }
  }
  return true;
}
