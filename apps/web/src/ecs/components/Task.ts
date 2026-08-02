export type TaskType =
  | "idle"
  | "eat"
  | "drink"
  | "sleep";

export interface Task {

  current: TaskType;

}