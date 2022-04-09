const timeout = i =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(i);
    }, i);
    setTimeout(() => {
      reject("超时");
    }, 5000);
  });

console.time();
pool(2, [
  () => timeout(1000),
  () => timeout(6000),
  () => timeout(2000),
  () => timeout(4000)
]).then(res => {
  console.log(res);
  console.timeEnd();
});
async function pool(limit, taskList) {
  let allTask = [],
    executing = [],
    retryListCounts = [],
    allList = Array.from(taskList);
  for (const task of allList) {
    console.log(task);
    const a = task();
    if (limit < allList.length) {
      a.then(() => {
        executing.splice(executing.indexOf(a), 1);
      }).catch(err => {
        console.log(err);
        executing.splice(executing.indexOf(a), 1);
        if (!retryListCounts.includes(taskList.indexOf(task))) {
          retryListCounts.push(taskList.indexOf(task));
          allList.push(task);
        }
      });
      executing.push(a);
      if (executing.length >= limit) {
        await Promise.race(executing).catch(() => {});
      }
    }
    allTask.push(a);
  }
  return Promise.allSettled(allTask);
}
