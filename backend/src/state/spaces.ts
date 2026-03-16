import { Pool } from "pg";
import type { ExtendedWebSocket } from "../types/socket.js";
import type { StoredMessage, Space } from "../types/socket.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const spaceClients: Record<string, Set<ExtendedWebSocket>> = {
  space1: new Set(),
  space2: new Set(),
  space3: new Set(),
};

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS spaces (
      name TEXT PRIMARY KEY
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS space_messages (
      id BIGSERIAL PRIMARY KEY,
      space_name TEXT NOT NULL REFERENCES spaces(name) ON DELETE CASCADE,
      username TEXT NOT NULL,
      text TEXT NOT NULL,
      timestamp BIGINT NOT NULL
    );
  `);

  await pool.query(`
    INSERT INTO spaces (name)
    VALUES ('space1'), ('space2'), ('space3')
    ON CONFLICT (name) DO NOTHING;
  `);
}

const schemaReady = ensureSchema();

async function getSpace(spaceName: string): Promise<Space | null> {
  await schemaReady;

  const existsResult = await pool.query<{ name: string }>(
    "SELECT name FROM spaces WHERE name = $1",
    [spaceName],
  );

  if (existsResult.rowCount === 0) {
    return null;
  }

  const messages = await getMessagesForSpace(spaceName);

  if (!spaceClients[spaceName]) {
    spaceClients[spaceName] = new Set();
  }

  return {
    clients: spaceClients[spaceName],
    messages,
  };
}

async function addClientToSpace(spaceName: string, ws: ExtendedWebSocket) {
  const space = await getSpace(spaceName);
  if (space) {
    space.clients.add(ws);
  }
}

async function removeClientFromSpace(spaceName: string, ws: ExtendedWebSocket) {
  const space = await getSpace(spaceName);
  if (space) {
    space.clients.delete(ws);
  }
}

async function removeClientFromAllSpaces(ws: ExtendedWebSocket) {
  for (const spaceName in spaceClients) {
    const clients = spaceClients[spaceName];
    if (clients) {
      clients.delete(ws);
    }
  }
}

async function addMessageToSpace(spaceName: string, message: StoredMessage) {
  await schemaReady;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const spaceExistsResult = await client.query<{ name: string }>(
      "SELECT name FROM spaces WHERE name = $1",
      [spaceName],
    );

    if (spaceExistsResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return;
    }

    await client.query(
      `
      INSERT INTO space_messages (space_name, username, text, timestamp)
      VALUES ($1, $2, $3, $4)
      `,
      [spaceName, message.username, message.text, message.timestamp],
    );

    await client.query(
      `
      DELETE FROM space_messages
      WHERE id IN (
        SELECT id
        FROM space_messages
        WHERE space_name = $1
        ORDER BY timestamp DESC, id DESC
        OFFSET 100
      )
      `,
      [spaceName],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getMessagesForSpace(spaceName: string): Promise<StoredMessage[]> {
  await schemaReady;

  const result = await pool.query<StoredMessage>(
    `
    SELECT username, text, timestamp
    FROM space_messages
    WHERE space_name = $1
    ORDER BY timestamp ASC, id ASC
    `,
    [spaceName],
  );

  return result.rows;
}

export {
  getSpace,
  addClientToSpace,
  removeClientFromSpace,
  removeClientFromAllSpaces,
  addMessageToSpace,
  getMessagesForSpace,
  type StoredMessage,
};
