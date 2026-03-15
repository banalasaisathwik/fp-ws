const spaces = {
    space1: { clients: new Set(), messages: [] },
    space2: { clients: new Set(), messages: [] },
    space3: { clients: new Set(), messages: [] }
};
function getSpace(spaceName) {
    return spaces[spaceName] || null;
}
function addClientToSpace(spaceName, ws) {
    const space = getSpace(spaceName);
    if (space) {
        space.clients.add(ws);
    }
}
function removeClientFromSpace(spaceName, ws) {
    const space = getSpace(spaceName);
    if (space) {
        space.clients.delete(ws);
    }
}
function removeClientFromAllSpaces(ws) {
    for (const spaceName in spaces) {
        const space = spaces[spaceName];
        if (space) {
            space.clients.delete(ws);
        }
    }
}
function addMessageToSpace(spaceName, message) {
    const space = getSpace(spaceName);
    if (space) {
        space.messages.push(message);
        // deleting first msh
        if (space.messages.length > 100) {
            space.messages.shift();
        }
    }
}
function getMessagesForSpace(spaceName) {
    const space = getSpace(spaceName);
    return space ? space.messages : [];
}
export { getSpace, addClientToSpace, removeClientFromSpace, removeClientFromAllSpaces, addMessageToSpace, getMessagesForSpace };
//# sourceMappingURL=spaces.js.map