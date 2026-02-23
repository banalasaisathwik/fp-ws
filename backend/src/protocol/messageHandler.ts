import {
  addClientToSpace,
  addMessageToSpace,
  getMessagesForSpace,
  getSpace,
  removeClientFromAllSpaces,
} from "../state/spaces.js";
import type { BaseMessage, ExtendedWebSocket } from "../types/socket.js";
import { sendError } from "../utlis/error.js";

function handleMessage(ws: ExtendedWebSocket, message: BaseMessage) {
  switch (message.type) {
    case "PING":
      ws.send(JSON.stringify({ type: "PONG" }));
      break;
    case "JOIN":
      if (
        typeof message.username !== "string" ||
        message.username.length === 0
      ) {
        sendError(ws, "Invalid username");
        return;
      }
      const space = getSpace(message.space);
      if ( space === null) {
        sendError(ws, "Space does not exist");
        return;
      }

      if (typeof message.space !== "string" || message.space.length === 0) {
        sendError(ws, "Invalid space name");
        return;
      }

      removeClientFromAllSpaces(ws);
      addClientToSpace(message.space, ws);

      ws.username = message.username;
      ws.connectionState = "JOINED";
      ws.currentSpace = message.space;

      ws.send(
        JSON.stringify({
          type: "JOINED",
          message: `Joined space ${message.space} successfully`,
        }),
      );
      ws.send(
        JSON.stringify({
          type: "HISTORY",
          messages: getMessagesForSpace(message.space),
        }),
      );
      space?.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "USER_JOINED",
              username: ws.username,
            }),
          );
        }
      });
       
      break;
    case "MESSAGE":
      if (ws.connectionState !== "JOINED" || !ws.currentSpace || !ws.username) {
        sendError(ws, "You must join a space before sending messages");
        return;
      }
      if (typeof message.text !== "string" || message.text.length === 0) {
        sendError(ws, "Message text cannot be empty");
        return;
      }
      const storedMessage = {
        username: ws.username!,
        text: message.text,
        timestamp: Date.now(),
      };
      addMessageToSpace(ws.currentSpace, storedMessage);
      getSpace(ws.currentSpace)?.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "NEW_MESSAGE",
              message: storedMessage,
            }),
          );
        }
      });

      break;


    default:
      sendError(ws, `Unsupported message type: ${message.type}`);
  }
}

export { handleMessage };
