import { GObject } from "./game-object";

export class Cell {
    contents: GObject[] = [];
    material: CellMaterial
    address: VectorAddress;
    constructor(type: CellMaterial, address: VectorAddress) {
        this.material = type;
        this.address = address;
    }
}

export enum CellMaterial {
    Grass,
    Dirt,
    Stone
}

type VectorAddress = { x: number, y: number }