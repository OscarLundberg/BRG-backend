import { Connection } from "../connection";
import { Event, EventType, Prepare, ResponseType } from "../messages";
import { Cell, CellMaterial } from "./data-types/cell";
import { AffectedScope, Mutation } from "./mutations";
import SimplexNoise from "simplex-noise"
import { Player } from "./data-types/player";


const worldSize = 64;

export class GameState {
    persistentState: Cell[][];
    variableState: Cell[][];
    static active: GameState;
    playerManifest: Record<string, Player>;
    UpdateAffected: Record<AffectedScope, AffectClients> = {
        0: () => null,
        1: (a, c) => {
            this.UpdateAffected[0](a, c);
            c.sendData(this.getVariableState())
        },
        2: (a, c) => {
            this.UpdateAffected[1](a, c);
            let conn = Connection.withId(a.target?.objectId ?? "")
            if (conn) conn.sendData(this.getVariableState());
        },
        3: () => { throw "NotImplemented"; },
        4: this.heartbeat
    }
    constructor() {



        this.persistentState = GameState.constructWorld();
        this.variableState = [];
        this.playerManifest = {};
        if (!GameState.active) {
            GameState.active = this;
        }
    }

    // Runs after mutation has been validated
    attemptMutation(action: Mutation, conn: Connection) {
        if (action.isValid()) {
            this.variableState = action.mutate(this.variableState);
            this.UpdateAffected[action.affectedScope ?? AffectedScope.Global](action, conn);
            return this.confirm();
        } else {
            return this.decline();
        }
    }
    confirm() {
        return { confirmed: true }
    }

    decline() {
        return { confirmed: false, message: "Declined by the server" }
    }

    /**
     * Emits the entire variable game state to every connected player
     */
    heartbeat() {
        const state = this.getVariableState()
        Connection.broadcast(state);
    }

    getVariableState() {
        return Prepare({ state: this.variableState }, "", ResponseType.VariableGameState);
    }
    getPersistentState() {
        return { state: this.persistentState }
    }


    static constructWorld() {
        const noise = new SimplexNoise()
        var cells: Cell[][] = [];
        for (let x = 0; x < worldSize; x++) {
            cells[x] = [];
            for (let y = 0; y < worldSize; y++) {
                var mat = Math.round(noise.noise2D(x * 0.01, y * 0.01)) + 1 as CellMaterial;
                cells[x][y] = new Cell(mat, { x, y });
            }
        }
        return cells;
    }

}

type AffectClients = (action: Mutation, conn: Connection) => void;






