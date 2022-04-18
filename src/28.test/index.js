class Scheduler {
  constructor() {
    this.taskNums = 0;
    this.waitList = [];
  }

  add(promiseCreator) {
    return new Promise(resolve => {
      if (typeof promiseCreator !== "function") return;
      if (this.taskNums >= 2) {
        this.waitList.push([promiseCreator, resolve]);
      } else {
        const a = promiseCreator();
        a.then(idx => {
          resolve(idx);
          this.taskNums--;
          this.runWaitTask(resolve);
        });
      }
      this.taskNums++;
    });
  }

  runWaitTask() {
    if (this.waitList.length) {
      const [task, resolve] = this.waitList.shift();
      task().then(idx => {
        resolve(idx);
      });
    }
  }
}

const timeout = (time, idx) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(idx), time);
  });
};

const scheduler = new Scheduler();

scheduler.add(() => timeout(1000, "1")).then(console.log);
scheduler.add(() => timeout(500, "2")).then(console.log);
scheduler.add(() => timeout(300, "3")).then(console.log);
scheduler.add(() => timeout(400, "4")).then(console.log);
