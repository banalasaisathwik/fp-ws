import type { BaseMessage } from "../types/socket.js";

function safeParse(data: string): BaseMessage | null {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function isValidBaseMessage(message: any): message is BaseMessage {
  return (
    message &&
    typeof message === "object" &&
    typeof message.type === "string" &&
    message.type.length > 0
  );
}

export { safeParse, isValidBaseMessage };