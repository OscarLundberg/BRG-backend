import { v4 } from "uuid";
import { Connection } from "./connection";
import WebSocket from "ws";
import { Prepare, ResponseType, Response } from "./messages";
export function chunks(s: string, size: number): string[] {
    return s.match(new RegExp(`.{1,${size}}`, "g")) as string[];
}

const maxMessageSize = 16384;
export function wsSend(ws: WebSocket, res: Response) {
    let data = JSON.stringify(res);

    if (data.length > maxMessageSize) {
        console.log();

        let partials = chunks(data, 8192);
        const id = v4();
        const totalParts = partials.length;
        partials.forEach((chunk, partId) => {
            wsSend(ws, Prepare({ chunk, id, partId, totalParts }, "", ResponseType.PartialResponse));
        })
    } else {
        ws.send(data);
    }
}