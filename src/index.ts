import WebSocket from "ws"
import { Connection, onConnection } from "./connection"
import { GameState } from "./game-logic/game-state";
import { Prepare } from "./messages"



let tick = 0;
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('server started')
    new GameState();
})




wss.on('connection', onConnection);
wss.on('listening', () => {
    console.log('listening on 8080')
})