import type { SimulationCalendar, SimulationTime } from "./types.ts";

const SEASONS: SimulationCalendar["season"][] = ["spring", "summer", "autumn", "winter"];
const DAYS_PER_SEASON = 30;
const DAYS_PER_YEAR = DAYS_PER_SEASON * SEASONS.length;

export function calendarFromTick(tick: number): SimulationCalendar {
  if (tick <= 0) {
    return { day: 0, season: "spring", year: 1 };
  }

  const zeroBasedDay = tick - 1;
  const year = Math.floor(zeroBasedDay / DAYS_PER_YEAR) + 1;
  const dayOfYear = zeroBasedDay % DAYS_PER_YEAR;
  const season = SEASONS[Math.floor(dayOfYear / DAYS_PER_SEASON)];
  const day = (dayOfYear % DAYS_PER_SEASON) + 1;

  return { day, season, year };
}

export class SimulationClock {
  private tickValue: number;

  constructor(initialTick = 0) {
    this.tickValue = initialTick;
  }

  get tick(): number {
    return this.tickValue;
  }

  get time(): SimulationTime {
    return { tick: this.tickValue, calendar: calendarFromTick(this.tickValue) };
  }

  advance(): SimulationTime {
    this.tickValue += 1;
    return this.time;
  }
}
