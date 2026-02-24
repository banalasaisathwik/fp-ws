
type Thumbnail = {
    spaceId : string,
    spaceName: string,
    src? : string,
    handleJoin : ((data : string) => void)
}

export const SpaceThumbnail = ({
  spaceId,
  spaceName,
  src,
  handleJoin,
}: Thumbnail) => {
  return (
    <div className="space-card">
      <div className="image-wrapper">
        {src ? (
          <img src={src} alt={spaceName} />
        ) : (
          <div className="placeholder">Image</div>
        )}
      </div>

      <button
        className="join-button"
        onClick={() => handleJoin(spaceId)}
      >
        Join {spaceName}
      </button>
    </div>
  )
}