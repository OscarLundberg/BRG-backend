// export default craftingTable:Record<string,  = {
// }



const craftingTable: Record<BaseMaterial, Recipe<any>> = {
    Sand: {},
    Stone: {},
    Wool: {},
    Wood: {


    }
}

export type Makes = {

}

export type Recipe<T extends Item> = {
    reagents: Record<number, Material | Item>
}

export type Material = BaseMaterial;
export type Item = Record<string, any> & {
    name: string
    recipe: Recipe<Item>
};


export enum BaseMaterial {
    Wood = "Wood",
    Stone = "Stone",
    Sand = "Sand",
    Wool = "Wool"
}
