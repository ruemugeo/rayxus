type Task = {
  interval: number;
  callback: () => void;
};

export class Scheduler {

  private readonly tasks: Task[] = [];

  schedule(interval: number, callback: () => void) {

    this.tasks.push({
      interval,
      callback
    });

  }

  update(tick: number) {

    for (const task of this.tasks) {

      if (tick % task.interval === 0) {
        task.callback();
      }

    }

  }

}