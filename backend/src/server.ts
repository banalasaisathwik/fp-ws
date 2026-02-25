import 'dotenv/config'
import { WebSocketServer,WebSocket } from "ws";
import type { ExtendedWebSocket } from "./types/socket.js";
import { isValidBaseMessage,safeParse } from "./utlis/validation.js";
import { handleMessage } from "./protocol/messageHandler.js";
import { sendError } from "./utlis/error.js";
import { getSpace, removeClientFromAllSpaces } from "./state/spaces.js";
import {  connectRedis, unsubscribeFromChannel } from "./infra/redis.js";

const wss = new WebSocketServer({ port: Number(process.env.PORT) ?? 8080 });
await connectRedis()

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as ExtendedWebSocket;

    if (client.isAlive === false) {
      console.log("Terminating dead connection");
      return client.terminate();
    }

    client.isAlive = false;
    client.ping();
  });
}, 300000);

wss.on("connection", (ws: ExtendedWebSocket) => {
  console.log("Client connected");
  
  ws.username = undefined;
  ws.currentSpace = undefined;
  ws.connectionState = "CONNECTED";
  ws.isAlive = true;

  ws.on("message", (rawData) => {
    const parsed = safeParse(rawData.toString());

    if (!parsed) {
      sendError(ws, "Invalid JSON format");
      return;
    }

    if (!isValidBaseMessage(parsed)) {
      sendError(ws, "Message must contain a valid 'type' field");
      return;
    }

    handleMessage(ws, parsed);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
    removeClientFromAllSpaces(ws);
    const username = ws.username;
    const spaceName = ws.currentSpace;
    
    if (!username || !spaceName) {
      return;
    }
    const space = getSpace(spaceName);
     if(space?.clients.size == 0 && ws.currentSpace){
      unsubscribeFromChannel(ws.currentSpace)
    }
    if (space) {
      space.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "USER_LEFT",
              username:username,
            }),
          );
        }
      });
    }
     
  });
});

