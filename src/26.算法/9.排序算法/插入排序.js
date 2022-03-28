function fnInsertionSorting(nums) {
  const list = nums.slice();
  const len = list.length;
  for (let i = 1; i < len; i++) {
    let item = list[i];
    let j = i;
    while (j > 0 && list[j - 1] > list[j]) {
      list[j] = list[j - 1];
      list[j - 1] = item;
      j--;
    }
  }
  return list;
}
