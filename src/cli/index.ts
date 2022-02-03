import inquirer from "inquirer";
import { Mutation } from "../game-logic/mutations";
import { getParams, Param } from "./helpers/get-params";
import YAML from "yaml";
import { select } from "./helpers/select";
import { actionMap, player } from "./action-map";





async function gameLoop(): Promise<unknown> {
    console.log(`You are at ${player.x}:${player.y}.`,
        `Your inventory ${player.inventory.length <= 0 ? "is empty." :
            "contains: " + player.inventory.map(e => e.name).join(" - ")}`);
    const round = inquirer.prompt(
        {
            message: "What would you like to do?",
            name: "action"
        }
    )
    const input = (await round).action;
    const match = matchAction(input);
    if (!match)
        return gameLoop();

    const { match: [keyword, action], params } = match;
    await action(...await promptFor(getParams(action, params), keyword));
    gameLoop();
}



// Give feedback
const feedbackMap: Record<string, string> = {

}


function matchAction(inp: string) {
    const match = Object.entries(actionMap).find(([key, val]) => inp.match(key));
    if (!match)
        return null;

    if (inp.startsWith(match[0])) {
        return { match, params: inp.split(" ").slice(1) }
    }
    return { match };
}

async function promptFor(params: Param[], prefix = "",) {
    const args: string[] = [];
    if (params.every(e => e.def))
        return params.map(e => e.def!);

    for (let par of params) {
        const { name, def } = par;
        const res = await inquirer.prompt({
            name,
            prefix,
            ... (def && { "default": def })
        }) as { [key: string]: string };
        args.push(res[name]);
    }
    return args;
}

type TVector = [number, number];
interface Vector extends TVector {
    add(vec:Vector):Vector;
}

(async () => {
    await gameLoop();
})();