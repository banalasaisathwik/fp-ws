function safeParse(data) {
    try {
        return JSON.parse(data);
    }
    catch {
        return null;
    }
}
function isValidBaseMessage(message) {
    return (message &&
        typeof message === "object" &&
        typeof message.type === "string" &&
        message.type.length > 0);
}
export { safeParse, isValidBaseMessage };
//# sourceMappingURL=validation.js.map