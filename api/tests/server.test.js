import tap from "tap";

/**
 * @type {{send: {data: any}[]}}
 */
const calls = {
    send: []
}
/** @type {Partial<import("@fastify/websocket").WebSocket>} */
const websocket = {
    send: (data) => {
        calls.send.push({data})
    }
}

function GameServer(ws) {
    this.games = [];
    this.ws = ws;
}

GameServer.prototype.createGame = function() {
    const game = {};
    this.games.push(game);
    this.ws.send({
        result: 'ok'
    })
}

const game = new GameServer(websocket);

tap.test("Test websocket", (t) => {
    t.plan(3);
    t.equal(game.games.length, 0)
    game.createGame();
    t.equal(game.games.length, 1)
    t.equal(calls.send[0].data.result, 'ok')
    t.end()
})