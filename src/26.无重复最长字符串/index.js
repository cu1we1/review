/**
 * 时间复杂度O(n)
 * 空间复杂度O(n)
 */
function lengthOfLongestSubstring(str) {
  function noRepeatLongestString(s) {
    const set = new Set();
    for (let m = 0, len = s.length; m < len; m++) {
      if (set.has(s[m])) return m;
      set.add(s[m]);
    }
    return s.length;
  }
  let maxLen = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const itemLen = noRepeatLongestString(str.slice(i));
    itemLen > maxLen && (maxLen = itemLen);
  }
  return maxLen;
}

var lengthOfLongestSubstring = function (s) {
  // 哈希集合，记录每个字符是否出现过
  const set = new Set();
  const n = s.length;
  // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动
  let rk = -1,
    ans = 0;
  for (let i = 0; i < n; ++i) {
    if (i != 0) {
      // 左指针向右移动一格，移除一个字符
      set.delete(s.charAt(i - 1));
    }
    while (rk + 1 < n && !set.has(s.charAt(rk + 1))) {
      // 不断地移动右指针
      set.add(s.charAt(rk + 1));
      ++rk;
    }
    // 第 i 到 rk 个字符是一个极长的无重复字符子串
    ans = Math.max(ans, rk - i + 1);
  }
  return ans;
};
