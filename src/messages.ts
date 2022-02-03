import { RawData } from "ws";
import { Connection, bidirectional, incomingEvents } from "./connection";


export function respondTo(eventType: EventType, conn: Connection, inputData?: any, requestId = "") {
    if (bidirectional.hasOwnProperty(eventType)) {
        const { responseType: returnType, ...responseData } = bidirectional[eventType](conn, inputData);
        conn.sendData(Prepare(responseData, requestId, returnType ?? ResponseType.Unknown));

    } else if (incomingEvents.hasOwnProperty(eventType)) {
        incomingEvents[eventType](conn, inputData);
    } else {
        conn.sendData(Prepare(inputData, requestId, ResponseType.Unknown));
    }
}

export function receive(message: RawData, conn: Connection) {
    let data;
    try {
        data = JSON.parse(message.toString()) as Event<any>;
        console.log("Received event " + EventType[data.type]);
        respondTo(data.type, conn, data, data.requestId);
    } catch (e) {
        respondTo(EventType.Unknown, conn, data);
    }
}

export function Prepare(data: Record<string, any>, responseTo = "", type = ResponseType.Unknown, isError = false) {
    return {
        responseTo: responseTo ?? "none",
        ...type && { type },
        ...isError && { error: data },
        ...!isError && { data: data },
    }
}
export interface Response {
    responseTo?: string;
    type?: ResponseType;
    data?: Record<string, any>
    error?: Record<string, any>
}

export interface Event<T> {
    type: EventType;
    data: any;
    requestId: string;
}

export enum MessageType {
    Private,
    Global,
    Group
}

export enum EventType {
    Unknown = -1,
    Reconnect,
    MutationRequest,
    MessageFromClient,
    RegisterPlayer,
}
export enum ResponseType {  
    PartialResponse = -2,
    Unknown = -1,
    Error,
    Identified,
    PlayerManifest,
    MutationApprove,
    MutationDecline,
    MessageFromServer,
    VariableGameState,
    PersistentGamestate,
}