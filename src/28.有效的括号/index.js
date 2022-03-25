function isValid(s) {
  if (s.length === 0 || s.length % 2 > 0) return false;
  const map = new Map([
      [")", "("],
      ["]", "["],
      ["}", "{"]
    ]),
    list = [];
  for (let i = 0, len = s.length; i < len; i++) {
    if (map.has(s[i])) {
      if (map.get(s[i]) !== list.pop()) return false;
    } else {
      list.push(s[i]);
    }
  }
  return list.length === 0;
}
