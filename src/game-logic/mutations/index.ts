import { Cell } from "../data-types/cell";
import { GObject } from "../data-types/game-object";

export interface Mutation {
    initiator: GObject;
    affectedScope?: AffectedScope; // Use global if undefined?
    isValid: () => boolean;
    mutate: (variableState: Cell[][]) => Cell[][];
    target?: GObject;
}

/**
 * Every scope with lower value than the selected, should be considered affected
 */
export enum AffectedScope {
    ServerOnly = 0,
    Initiator = 1,
    Target = 2,
    PlayersWithinRadius = 3,
    Global = 4
}