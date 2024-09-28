import { Skill } from "./skill.model";

export interface Person{
  personName: string,
  age: number,
  skills: Skill[]
}
