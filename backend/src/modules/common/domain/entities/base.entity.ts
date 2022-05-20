import { v4 as uuidv4 } from "uuid";

export abstract class Entity {
  public uuid: string;

  constructor(uuid?: string) {
    this.uuid = uuid ? uuid : uuidv4();
  }
}
