export class GObject {
    type: ObjectType;
    objectId: string;
    quantity?: number;
    constructor(type: ObjectType, objectId: string, quantity?: number) {
        this.type = type;
        this.objectId = objectId;
        this.quantity = quantity;
    }
}

export enum ObjectType {
    Player = 0,
    Item = 1,
    Container = 2,
    Exit = 3,
    NPC = 4
}