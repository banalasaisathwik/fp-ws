import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { setOnMessage, sendMessage } from "../ws"
import type { Message } from "../types/message"

function Space() {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
    setOnMessage((data) => {
      if (data.type === "HISTORY") {
        setMessages(data.messages)
      }

      if (data.type === "NEW_MESSAGE") {
        setMessages(prev => [...prev, data.message])
      }
    })
  }, [])

  function handleSend() {
    sendMessage(text)
    setText("")
  }

  return (
    <div>
      <h2>Space: {id}</h2>

      {messages.map((m: any, i) => (
        <div key={i}>
          <strong>{m.username}</strong>: {m.text}
        </div>
      ))}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default Space