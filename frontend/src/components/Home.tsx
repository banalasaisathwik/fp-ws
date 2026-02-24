import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { joinSpace, addMessageListener } from "../ws"
import { SpaceThumbnail } from "./Spacethumbnail"

function Home() {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  function handleJoin(space: string) {
    if (!username.trim()) {
      alert("Please enter username")
      return
    }

    const unsubscribe = addMessageListener((data) => {
      if (data.type === "JOINED") {
        unsubscribe()
        navigate(`/space/${space}`)
      }

      if (data.type === "ERROR") {
        alert(data.message)
      }
    })

    joinSpace(username, space)
  }

  return (
    <div className="home-container">
      <input
        className="username-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      <div className="spaces-container">
        <SpaceThumbnail
          spaceId="space1"
          spaceName="HK Web Channel"
          src="https://picsum.photos/400/300"
          handleJoin={handleJoin}
        />

        <SpaceThumbnail
          spaceId="space2"
          spaceName="RSHB AI Channel"
          src="https://picsum.photos/401/300"
          handleJoin={handleJoin}
        />

        <SpaceThumbnail
          spaceId="space3"
          spaceName="Open Room"
          src="https://picsum.photos/402/300"
          handleJoin={handleJoin}
        />
      </div>
    </div>
  )
}

export default Home