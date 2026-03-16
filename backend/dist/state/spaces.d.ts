import type { ExtendedWebSocket } from "../types/socket.js";
import type { StoredMessage, Space } from "../types/socket.js";
declare function getSpace(spaceName: string): Promise<Space | null>;
declare function addClientToSpace(spaceName: string, ws: ExtendedWebSocket): Promise<void>;
declare function removeClientFromSpace(spaceName: string, ws: ExtendedWebSocket): Promise<void>;
declare function removeClientFromAllSpaces(ws: ExtendedWebSocket): Promise<void>;
declare function addMessageToSpace(spaceName: string, message: StoredMessage): Promise<void>;
declare function getMessagesForSpace(spaceName: string): Promise<StoredMessage[]>;
export { getSpace, addClientToSpace, removeClientFromSpace, removeClientFromAllSpaces, addMessageToSpace, getMessagesForSpace, type StoredMessage, };
//# sourceMappingURL=spaces.d.ts.map