
import { v4 } from "uuid";
import WebSocket from "ws"
import { Player } from "./game-logic/data-types/player";
import { GameState } from "./game-logic/game-state";
import { chunks, wsSend } from "./helpers";
import { Event, EventType, receive, Response, Prepare, respondTo, MessageType, ResponseType } from "./messages";
const connections: Connection[] = [];
export class Connection {

    ws;
    userId?: string;
    deferred: Response[] = [];
    constructor(ws: WebSocket) {
        this.ws = ws;
        this.init();
    }

    static withId(userId: string) {
        return connections.find(e => e.userId == userId);
    }

    static broadcast(data: any) {
        const preparedData = JSON.stringify(data);
        connections.forEach(e => e.ws.send(preparedData));
    }

    init() {
        this.ws.on('message', (data) => this.message(data, this));
        this.ws.on('close', this.close);
        this.identify();
    }

    identify() {
        this.userId = v4();
        this.sendData(Prepare({ userId: this.userId }, "", ResponseType.Identified));
    }

    sendData(res: Response) {
        wsSend(this.ws, res);
    }

    message(data: WebSocket.RawData, instance: Connection) {
        
        receive(data, instance);
    }

    close(data: number) {

    }
}

type AutoReply = (conn: Connection, request?: Event<any>) => Record<string, any> & { responseType?: ResponseType };
export const bidirectional: Record<number, AutoReply> = {
    [EventType.MutationRequest]: (conn, req) => {
        return GameState.active.attemptMutation(req?.data, conn);
    },
    [EventType.Unknown]: (conn, req) => {
        return { message: "Unknown event", responseType: ResponseType.Error }
    }

}

type Incoming = (conn: Connection, request?: Event<any>) => void;
export const incomingEvents: Record<number, Incoming> = {
    [EventType.RegisterPlayer]: (conn, req) => {
        if (req?.data.displayName && conn.userId) {
            GameState.active.playerManifest[conn.userId] = new Player(conn.userId, req?.data.displayName);
            connections.push(conn);
            let res = Prepare({ players: GameState.active.playerManifest }, "", ResponseType.PlayerManifest);
            conn.sendData(Prepare(GameState.active.getPersistentState(), "", ResponseType.PersistentGamestate));
            Connection.broadcast(res);
        } else {
            conn.sendData(Prepare({ message: "Invalid displayName" }, req?.data.requestId, ResponseType.Error, true));
        }
    }, [EventType.MessageFromClient]: (conn, req) => {
        // Construct message from server
        const data = { sender: conn.userId, message: req?.data.message, messageType: req?.data.messageType };
        const res = Prepare({ ...data }, "", ResponseType.MessageFromServer);
        if (data.messageType == MessageType.Private) {
            Connection.withId(req?.data.recipient)?.sendData(res)
        } else if (data.messageType == MessageType.Global) {
            Connection.broadcast(res);
        }
    }
}

export function onConnection(ws: WebSocket) {
    new Connection(ws)
}

