import { Mutation } from ".";
import { Cell } from "../data-types/cell";
import { GObject } from "../data-types/game-object";

export class ConsumeObject implements Mutation {
    initiator: GObject;
    target: GObject;
    dummy: string = ""
    constructor(inititator: GObject, target: GObject) {
        this.initiator = inititator
        this.target = target;
    }
    isValid() {
        return false;
    }
    mutate(variableState: Cell[][]) {
        return variableState;
    }
}

