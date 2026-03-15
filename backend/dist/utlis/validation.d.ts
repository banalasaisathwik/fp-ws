import type { BaseMessage } from "../types/socket.js";
declare function safeParse(data: string): BaseMessage | null;
declare function isValidBaseMessage(message: any): message is BaseMessage;
export { safeParse, isValidBaseMessage };
//# sourceMappingURL=validation.d.ts.map