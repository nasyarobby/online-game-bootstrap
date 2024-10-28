import fastify from "fastify";

import ws from '@fastify/websocket'

const server = fastify({
    logger: true
});

server.register(ws)

server.register(async function(server) {
    server.get('/', {websocket: true}, (socket, req) => {
        socket.on('message', message => {
            req.log.info({message: message.toString()})
            socket.send('hi')
        })
    })
})


server.listen({
    host: "0.0.0.0",
    port: 7000,
})