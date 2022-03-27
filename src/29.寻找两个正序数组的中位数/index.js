/**
 * 1.两个数组合并成一个，并且记性排序。
 * 2.根据新数组的长度，计算中位数。
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const result = [],
    list1 = nums1[0] > nums2[0] ? nums2 : nums1,
    list2 = nums1[0] > nums2[0] ? nums1 : nums2;
  let idx = 0;
  for (let i = 0, len1 = nums1.length; i < len1; ++i) {
    if (list1[i] > list2[idx]) {
      while (list2[idx] <= list1[i]) {
        result.push(list2[idx]);
        idx++;
      }
    }
    result.push(list1[i]);
  }
  while (idx < list2.length) {
    result.push(list2[idx]);
    idx++;
  }
  const middleIdx = (list1.length + list2.length) / 2;
  if (middleIdx % 1 === 0) {
    // 整数
    return (result[middleIdx - 1] + result[middleIdx]) / 2;
  } else {
    // 非整数
    return result[Math.ceil(middleIdx) - 1];
  }
};

/**
 * 1.两个数组合并成一个，并且记性排序。
 * 2.根据新数组的长度，计算中位数。
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const result = [...nums1, ...nums2];
  const middleIdx = result / 2;
  if (middleIdx % 1 === 0) {
    // 整数
    return (result[middleIdx - 1] + result[middleIdx]) / 2;
  } else {
    // 非整数
    return result[Math.ceil(middleIdx) - 1];
  }
};
