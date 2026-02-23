import type { ExtendedWebSocket } from "../types/socket.js";
import type { StoredMessage,Space } from "../types/socket.js";

const spaces: Record<string, Space> = {
  space1: { clients: new Set(), messages: [] },
  space2: { clients: new Set(), messages: [] },
  space3: { clients: new Set(), messages: [] }
}

function getSpace(spaceName: string): Space | null {
  return spaces[spaceName] || null;
}

function addClientToSpace(spaceName: string, ws: ExtendedWebSocket) {
  const space = getSpace(spaceName);
  if (space) {
    space.clients.add(ws);
  }
}

function removeClientFromSpace(spaceName: string, ws: ExtendedWebSocket) {
  const space = getSpace(spaceName);
    if (space) {
    space.clients.delete(ws);
  }
}

function removeClientFromAllSpaces(ws: ExtendedWebSocket) {
    for (const spaceName in spaces) {
        const space = spaces[spaceName];
        if (space) {
            space.clients.delete(ws);
        }
    }
}

function addMessageToSpace(spaceName: string, message: StoredMessage) {
  const space = getSpace(spaceName);
  if (space) {
    space.messages.push(message);
    // deleting first msh
    if (space.messages.length > 100) {
      space.messages.shift();
    }
  }
}

function getMessagesForSpace(spaceName: string): StoredMessage[] {
  const space = getSpace(spaceName);
  return space ? space.messages : [];
}

export { getSpace, addClientToSpace, removeClientFromSpace, removeClientFromAllSpaces, addMessageToSpace, getMessagesForSpace,type StoredMessage };