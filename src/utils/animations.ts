export const ANIMATION = {
  quick: 180,
  normal: 280,
  slow: 450,
  commentary: 2400
};

export class AnimationQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = false;

  enqueue(task: () => Promise<void>) {
    this.queue.push(task);
    this.run();
  }

  private async run() {
    if (this.running) return;
    this.running = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) continue;
      await task();
    }
    this.running = false;
  }
}
