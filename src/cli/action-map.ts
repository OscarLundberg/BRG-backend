// Affect state

import { select as trySelect } from "./helpers/select";
import YAML from 'yaml';
import { getParams } from "./helpers/get-params";
import { Item } from "./crafting-table";
export const player = {
    x: 0,
    y: 0,
    inventory: [] as Item[]
}



export const actionMap: Record<string, GameAction> = {
    create(what, when, how = "idk") {
        player.inventory.push({ name: what, created: when, origin: how });
    },
    inspect(what) {
        let item;
        trySelect(e => e.name == what, player.inventory,
            selected => YAML.stringify(selected),
            els => "You dont have that in your inventory");
    },
    go(direction) {
        const directions = { north: [0, 1], east: [1, 0], south: [0, -1], west: [-1, 0] } as { [key: string]: [number, number] };
        trySelect(direction, directions, ([x, y]) => {
            player.x += x;
            player.y += y;
            return "";
        }, els => "invalid direction");
    },
    help() {
        const helpSection = Object.keys(actionMap)
            .map(key => {
                const params = getParams(actionMap[key]).map(e => e.name);
                return params.length >= 1 ? { [key]: params } : key;
            })
        return YAML.stringify(helpSection)
    }
}
type GameAction = (...arg: string[]) => unknown;
