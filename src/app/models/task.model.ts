import { Person } from "./person.model";

export interface Task {
  id: number,
  taskName: string,
  state: boolean,
  date: string,
  persons: Person[],
}
