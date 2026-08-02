export class SimulationClock {

    private ticks = 0;

    update() {
        this.ticks++;
    }

    get tick() {
        return this.ticks;
    }

    get minute() {
        return Math.floor(this.ticks / 60) % 60;
    }

    get hour() {
        return Math.floor(this.ticks / 3600) % 24;
    }

    get day() {
        return Math.floor(this.ticks / (3600 * 24)) + 1;
    }

    get month() {
        return Math.floor((this.day - 1) / 30) + 1;
    }

    get year() {
        return Math.floor((this.month - 1) / 12) + 1;
    }

    get timeString() {

        const h = this.hour.toString().padStart(2, "0");
        const m = this.minute.toString().padStart(2, "0");

        return `${h}:${m}`;

    }

}