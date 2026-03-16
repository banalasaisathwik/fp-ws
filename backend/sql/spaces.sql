CREATE TABLE IF NOT EXISTS spaces (
  name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS space_messages (
  id BIGSERIAL PRIMARY KEY,
  space_name TEXT NOT NULL REFERENCES spaces(name) ON DELETE CASCADE,
  username TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

INSERT INTO spaces (name)
VALUES ('space1'), ('space2'), ('space3')
ON CONFLICT (name) DO NOTHING;
