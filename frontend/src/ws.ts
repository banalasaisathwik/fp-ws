
let ws: WebSocket | null = null

let listeners: ((data: any) => void)[] = []

export function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) return

  ws = new WebSocket("ws://localhost:8080")

  ws.onopen = () => {
    console.log("WebSocket Connected")
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      listeners.forEach(listener => listener(data))

    } catch {
      console.error("Invalid JSON received")
    }
  }

  ws.onclose = () => {
    console.log("WebSocket Disconnected")
    ws = null
  }
}

export function addMessageListener(cb: (data: any) => void) {
  listeners.push(cb)

  return () => {
    listeners = listeners.filter(l => l !== cb)
  }
}

export function joinSpace(username: string, space: string) {
  connect()

  const sendJoin = () => {
    ws?.send(JSON.stringify({
      type: "JOIN",
      username,
      space
    }))
  }

  if (ws?.readyState === WebSocket.OPEN) {
    sendJoin()
  } else {
    ws?.addEventListener("open", sendJoin, { once: true })
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