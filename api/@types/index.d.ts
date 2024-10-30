import { WebSocket } from "@fastify/websocket";
import GameServer from "../GameServer";

export type EventMessageHandler = (
  this: WebSocket & { id: string },
  game: GameServer,
  data: WebSocket.RawData
) => void;
