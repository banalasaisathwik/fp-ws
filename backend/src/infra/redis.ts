import { createClient } from "redis";
import { randomUUID } from "crypto";
import { getSpace } from "../state/spaces.js";

export const serverId = randomUUID()

export const pubClient = createClient({
    username: process.env.REDIS_USERNAME ?? 'default_user',
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: 14432
    }
});

export const subClient = createClient({
    username: process.env.REDIS_USERNAME ?? 'default_user',
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: 14432
    }
});

const subscribedChannels = new Set<string>();

export async function connectRedis(){
    await pubClient.connect()
    await subClient.connect()
    console.log("redis connected")
}

export async function subscribeToChannel(channel:string){
    if (subscribedChannels.has(channel)) return

    await subClient.subscribe(channel, (message) => {
    handleRedisMessage(channel, message);
  });
    subscribedChannels.add(channel)
    console.log(`subscribed to ${channel}`)
}

export async function unsubscribeFromChannel(channel: string) {
  if (!subscribedChannels.has(channel)) return;

  await subClient.unsubscribe(channel);
  subscribedChannels.delete(channel);

  console.log("Unsubscribed from:", channel);
}

function handleRedisMessage(channel: string, rawMessage: string) {
  const parsed = JSON.parse(rawMessage);

  if (parsed.serverId === serverId) return;

  const space = getSpace(channel);
  if (!space) return;

  space.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(parsed.data));
    }
  });
}

