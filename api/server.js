import fastify from "fastify";

import ws from '@fastify/websocket'
import { handleNewConnection, handleNewMessage } from "./handles.js";
import GameServer from "./GameServer.js";

const server = fastify({
    logger: true
});

server.register(ws)

server.register(async function(server) {
    const gameServer = new GameServer()
    server.get('/', {websocket: true}, (socket, req) => {

        handleNewConnection.apply(socket, [gameServer])
        socket.on('message', (message) => {
            handleNewMessage.apply(socket, [gameServer, message])
        })
    })
})


server.listen({
    host: "0.0.0.0",
    port: 7000,
})