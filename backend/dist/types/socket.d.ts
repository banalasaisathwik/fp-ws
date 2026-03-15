import { WebSocket } from "ws";
interface ExtendedWebSocket extends WebSocket {
    username?: string | undefined;
    currentSpace?: string | undefined;
    connectionState?: "CONNECTED" | "JOINED";
    isAlive?: boolean;
}
type BaseMessage = {
    type: string;
    [key: string]: any;
};
type StoredMessage = {
    username: string;
    text: string;
    timestamp: number;
};
type Space = {
    clients: Set<ExtendedWebSocket>;
    messages: StoredMessage[];
};
export type { ExtendedWebSocket, BaseMessage, StoredMessage, Space };
//# sourceMappingURL=socket.d.ts.map