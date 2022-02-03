import { Mutation } from ".";
import { Cell } from "../data-types/cell";
import { GObject } from "../data-types/game-object";

export class CreateObject implements Mutation {
    initiator: GObject;
    target: GObject;
    constructor(initiator: GObject, target: GObject) {
        this.initiator = initiator;
        this.target = target;
    }
    isValid() {
        return false
    }
    mutate(variableState: Cell[][]) {
        return variableState;
    }
}