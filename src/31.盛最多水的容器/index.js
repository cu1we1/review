/**
 * 双指针方法
 */
var maxArea = function (height) {
  let maxCap,
    leftIndex = 0,
    rightIndex = height.length - 1;
  while (leftIndex < rightIndex) {
    const itemCap =
      (rightIndex - leftIndex) *
      Math.min(height[leftIndex], height[rightIndex]);
    itemCap > maxCap && (maxCap = itemCap);
    if (height[leftIndex] > height[rightIndex]) {
      rightIndex -= 1;
    } else {
      leftIndex += 1;
    }
  }
  return maxCap;
};
