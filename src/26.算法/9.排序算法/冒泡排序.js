/**
 * 冒泡排序
 * 时间复杂度：O(n²)
 * 空间复杂度：O(n)
 */
function fnBubbleSort(list) {
  let tag = true;
  const len = list.length,
    nums = list.slice();
  while (tag) {
    tag = false;
    for (let i = 0; i < len; i++) {
      if (nums[i] > nums[i + 1]) {
        nums[i] += nums[i + 1];
        nums[i + 1] = nums[i] - nums[i + 1];
        nums[i] = nums[i] - nums[i + 1];
        tag = true;
      }
    }
  }
  return nums;
}
