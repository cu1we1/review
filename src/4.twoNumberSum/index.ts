let a = [1, 7, 1, 11, 2, 15],
  target = 9;

function twoNumberSum1() {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (a[i] + a[j] === target) return [i, j];
    }
  }
}

function twoNumberSum2() {
  for (let i = 0; i < a.length; i++) {
    let idx = a.indexOf(target - a[i]);
    if (idx > -1) return [i, idx];
  }
}

function twoNumberSum3(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
}
