export class TimeSystem {

    private tick = 0;

    update() {
        this.tick++;
    }

    getTick() {
        return this.tick;
    }

    every(interval: number) {
        return this.tick % interval === 0;
    }

    after(time: number) {
        return this.tick >= time;
    }

}