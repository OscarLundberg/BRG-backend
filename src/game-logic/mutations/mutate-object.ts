import { Mutation } from ".";
import { Cell } from "../data-types/cell";
import { GObject } from "../data-types/game-object";


export class MutateObject implements Mutation {
    initiator: GObject;
    target: GObject;
    mutation: Record<string, any>
    constructor(inititator: GObject, target: GObject, mutation: Record<string, any>) {
        this.initiator = inititator
        this.target = target;
        this.mutation = mutation;
    }
    isValid() {
        return false;
    }
    mutate(variableState: Cell[][]) {
        return variableState;
    }
}