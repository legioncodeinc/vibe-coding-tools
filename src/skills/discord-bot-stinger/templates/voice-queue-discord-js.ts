/**
 * Lavalink 4 + Shoukaku voice queue stub for discord.js v14.
 *
 * Prerequisites:
 *   npm install shoukaku
 *   A running Lavalink v4 server (see guides/04-voice-pipeline.md)
 *
 * Replace placeholders:
 *   LAVALINK_HOST     — hostname or IP of your Lavalink server
 *   LAVALINK_PORT     — port (default 2333)
 *   LAVALINK_PASSWORD — password from application.yml
 */
import { Client, GatewayIntentBits } from "discord.js";
import { Shoukaku, Connectors } from "shoukaku";

const NODES = [
  {
    name: "main",
    url: "LAVALINK_HOST:LAVALINK_PORT",
    auth: "LAVALINK_PASSWORD",
  },
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), NODES);

shoukaku.on("error", (_, err) => console.error("Shoukaku error:", err));

// In-memory queue per guild
const queues = new Map<string, string[]>(); // guildId -> track identifiers

async function play(guildId: string, channelId: string, query: string) {
  const node = shoukaku.getIdealNode();
  if (!node) throw new Error("No Lavalink nodes available");

  let player = shoukaku.players.get(guildId);
  if (!player) {
    player = await shoukaku.joinVoiceChannel({
      guildId,
      channelId,
      shardId: 0, // adjust for sharded bots
      deaf: true,
    });
  }

  const result = await node.rest.resolve(`ytsearch:${query}`);
  if (!result || result.loadType === "empty" || result.loadType === "error") {
    throw new Error(`No results for query: ${query}`);
  }

  const track = result.data instanceof Array ? result.data[0] : result.data;

  player.playTrack({ track });

  player.on("end", () => {
    const queue = queues.get(guildId) ?? [];
    if (queue.length > 0) {
      const next = queue.shift()!;
      queues.set(guildId, queue);
      play(guildId, channelId, next).catch(console.error);
    } else {
      player!.disconnect();
    }
  });
}

client.login(process.env.DISCORD_TOKEN);
