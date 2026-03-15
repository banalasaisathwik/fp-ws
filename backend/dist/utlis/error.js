import { WebSocket } from "ws";
function sendError(ws, errorMessage) {
    ws.send(JSON.stringify({
        type: "ERROR",
        message: errorMessage,
    }));
}
export { sendError };
//# sourceMappingURL=error.js.map