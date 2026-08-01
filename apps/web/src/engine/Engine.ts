export class Engine {
  private running = false;

  start(): void {
    this.running = true;
    console.log("🚀 Rayxus Engine Started");
  }

  stop(): void {
    this.running = false;
    console.log("🛑 Rayxus Engine Stopped");
  }

  get isRunning(): boolean {
    return this.running;
  }
}