let ws: WebSocket | null = null
let messageHandler: ((data: any) => void) | null = null

export function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) return

  ws = new WebSocket("ws://localhost:8080")

  ws.onopen = () => {
    console.log("Connected")
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      messageHandler?.(data)
    } catch {
      console.error("Invalid JSON")
    }
  }

  ws.onclose = () => {
    console.log("Disconnected")
    ws = null
  }
}

export function setOnMessage(cb: (data: any) => void) {
  messageHandler = cb
}

export function joinSpace(username: string, space: string) {
  connect()

  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: "JOIN",
      username,
      space
    }))
  } else {
    ws?.addEventListener("open", () => {
      ws?.send(JSON.stringify({
        type: "JOIN",
        username,
        space
      }))
    }, { once: true })
  }
}

export function sendMessage(text: string) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: "MESSAGE",
      text
    }))
  }
}