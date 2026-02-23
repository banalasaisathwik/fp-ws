import { WebSocket } from "ws";

function sendError(ws: WebSocket, errorMessage: string) {
  ws.send(
    JSON.stringify({
      type: "ERROR",
      message: errorMessage,
    })
  );
}

export { sendError };