import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { addMessageListener, getHistory, sendMessage } from "../ws"
import { toast, ToastContainer } from "react-toastify"

type Message = {
  username: string
  text: string
  timestamp: number
}

function Space() {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
    
    const unsubscribe = addMessageListener((data) => {

      if (data.type === "HISTORY") {
        setMessages(data.messages)
      }

      if (data.type === "NEW_MESSAGE") {
        setMessages(prev => [...prev, data.message])
      }

      if (data.type === "USER_JOINED") {
        toast.info(`${data.username} joined`)
      }

      if (data.type === "USER_LEFT") {
        toast.info(`${data.username} left`)
      }

    })
    getHistory()
    return unsubscribe

  }, [])

  function handleSend() {
    if (!text.trim()) return
    sendMessage(text)
    setText("")
  }

  return (
    <div>
      <ToastContainer autoClose={1500}/>
      <h2>Space: {id}</h2>

      {messages.map((m, i) => (
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