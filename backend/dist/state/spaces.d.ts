import type { ExtendedWebSocket } from "../types/socket.js";
import type { StoredMessage, Space } from "../types/socket.js";
declare function getSpace(spaceName: string): Space | null;
declare function addClientToSpace(spaceName: string, ws: ExtendedWebSocket): void;
declare function removeClientFromSpace(spaceName: string, ws: ExtendedWebSocket): void;
declare function removeClientFromAllSpaces(ws: ExtendedWebSocket): void;
declare function addMessageToSpace(spaceName: string, message: StoredMessage): void;
declare function getMessagesForSpace(spaceName: string): StoredMessage[];
export { getSpace, addClientToSpace, removeClientFromSpace, removeClientFromAllSpaces, addMessageToSpace, getMessagesForSpace, type StoredMessage };
//# sourceMappingURL=spaces.d.ts.map